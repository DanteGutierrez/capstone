using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using StackExchange.Redis;

namespace capstone
{
    namespace Controllers
    {
        [ApiController]
        [Route("")]
        public class ScheduleController : ControllerBase
        {
            private readonly IMongoDatabase _db;
            private readonly IMongoCollection<Schedule> schedules;
            private readonly IMongoCollection<Course> courses;
            
            private readonly IMongoCollection<Account> accounts;
            private readonly IDatabase authorization;

            public ScheduleController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                schedules = _db.GetCollection <Schedule> ("schedules");
                courses = _db.GetCollection <Course> ("courses");
                accounts = _db.GetCollection <Account> ("accounts");

                var _redis = ConnectionMultiplexer.Connect(config.GetConnectionString("redis"));
                authorization = _redis.GetDatabase();
            }
            public async Task<bool> VerifyAccount(string? Id) {
                if(string.IsNullOrEmpty(Id)) return false;

                return accounts.Find(user => user._id == ObjectId.Parse(Id)).ToList().Any();
            }
            public async Task<bool> VerifyCourse(string? Id) {
                if (string.IsNullOrEmpty(Id)) return false;

                return courses.Find(course => course._id == ObjectId.Parse(Id)).ToList().Any();
            }
            private async Task<bool> CheckAuthorization(string? userid, string? auth)
            {
                if (string.IsNullOrEmpty(auth) || string.IsNullOrEmpty(userid)) return false;

                string value = authorization.StringGet(userid);

                if (string.IsNullOrEmpty(value)) return false;

                return value.Equals(auth);
            }
            [HttpPost]
            [Route("create")]
            public async Task<IResult> CreateSchedule(Schedule schedule, string? auth) {
                if(!await VerifyAccount(schedule.AccountId)) return Results.BadRequest("Invalide Coach");
                if(!await VerifyCourse(schedule.CourseId)) return Results.BadRequest("Invalid Course");
                if(!await CheckAuthorization(schedule.AccountId, auth)) return Results.BadRequest("Invalid authorization");

                if(schedule.Duration <= 0) return Results.BadRequest("Invalid Duration");
                if(schedule.StartTime <= 0 || schedule.StartTime + schedule.Duration > 1440) return Results.BadRequest("Invalid Start Time");

                if(schedule.Day <= 0 || schedule.Day > (schedule.Year % 4 == 0 && schedule.Year % 100 != 0 ? 366 : 365)) return Results.BadRequest("Invalid Day");

                await schedules.InsertOneAsync(schedule);
                return Results.Ok();
            }
            [HttpDelete]
            [Route("delete/{id}")]
            public async Task<IResult> DeleteSchedule(string? userid, string id, string? auth) {
                if (!await CheckAuthorization(userid, auth)) return Results.BadRequest("Invalid authorization");

                if(!schedules.Find(schedule => schedule._id == ObjectId.Parse(id)).ToList().Any()) return Results.BadRequest("Schedule id is invalid");

                var filter = Builders<Schedule>.Filter.Eq(s => s._id, ObjectId.Parse(id));
                await schedules.DeleteOneAsync(filter);
                return Results.Ok("Item Deleted");
            }
            [HttpPost]
            [Route("find")]
            public async Task<IResult> FindSchedules(Search search) {
                List<Schedule> list = new();
                try {
                    list = schedules.Find(s => s.Day == search.Day && s.Year == search.Year).ToList();
                }
                catch(Exception _i) {
                    return Results.BadRequest("There was an issue");
                }

                if(search.StartTime != null) list = list.FindAll(s => s.StartTime >= search.StartTime);
                    
                if(search.EndTime != null) list = list.FindAll(s => s.StartTime + s.Duration <= search.EndTime);

                if(search.Coaches.Count() > 0) list = list.FindAll(s => search.Coaches.Contains(s.AccountId));

                if(search.Courses.Count() > 0) list = list.FindAll(s => search.Courses.Contains(s.CourseId) || 
                                                                        accounts.Find(user => user._id == ObjectId.Parse(s.AccountId)).ToList().First().PreferredCourses.Contains(s.CourseId));

                return Results.Ok(list);
            }
        }
    }
}