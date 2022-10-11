using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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

            public ScheduleController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                schedules = _db.GetCollection <Schedule> ("schedules");
                courses = _db.GetCollection <Course> ("courses");
                accounts = _db.GetCollection <Account> ("accounts");
            }
            public async Task<bool> VerifyAccount(string? Id) {
                if(string.IsNullOrEmpty(Id)) return false;
                Account temp;
                try {
                    temp = accounts.Find(user => user._id == ObjectId.Parse(Id)).ToList().First();
                }
                catch(Exception _i) {
                    return false;
                }
                return true;
            }
            public async Task<bool> VerifyCourse(string? Id) {
                if (string.IsNullOrEmpty(Id)) return false;
                Course temp;
                try
                {
                    temp = courses.Find(course => course._id == ObjectId.Parse(Id)).ToList().First();
                }
                catch (Exception _i)
                {
                    return false;
                }
                return true;
            }
            private async Task<bool> CheckAuthorization(string? auth)
            {
                if (string.IsNullOrEmpty(auth)) return false;
                return true;
                //TODO redis
            }
            [HttpPost]
            [Route("create")]
            public async Task<IResult> CreateSchedule(Schedule schedule, string? auth) {
                if(!await CheckAuthorization(auth)) return Results.BadRequest("Invalid authorization");
                if(!await VerifyAccount(schedule.AccountId)) return Results.BadRequest("Invalide Coach");
                if(!await VerifyCourse(schedule.CourseId)) return Results.BadRequest("Invalid Course");

                if(schedule.Duration <= 0) return Results.BadRequest("Invalid Duration");
                if(schedule.StartTime <= 0 || schedule.StartTime + schedule.Duration > 1440) return Results.BadRequest("Invalid Start Time");

                if(schedule.Day <= 0 || schedule.Day > (schedule.Year % 4 == 0 && schedule.Year % 100 != 0 ? 366 : 365)) return Results.BadRequest("Invalid Day");

                await schedules.InsertOneAsync(schedule);
                return Results.Ok();
            }
            [HttpDelete]
            [Route("delete/{id}")]
            public async Task<IResult> DeleteSchedule(string id, string? auth) {
                if (!await CheckAuthorization(auth)) return Results.BadRequest("Invalid authorization");

                Schedule schedule;
                try {
                    schedule = schedules.Find(schedule => schedule._id == ObjectId.Parse(id)).ToList().First();
                }
                catch(Exception _i) {
                    return Results.BadRequest("Schedule id is invalid");
                }

                var filter = Builders<Schedule>.Filter.Eq(s => s._id, ObjectId.Parse(id));
                await schedules.DeleteOneAsync(filter);
                return Results.Ok("Item Deleted");
            }
        }
    }
}