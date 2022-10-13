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
        public class CourseController : ControllerBase
        {
            private readonly IMongoDatabase _db;
            private readonly IMongoCollection<Course> courses;
            public CourseController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                courses = _db.GetCollection <Course> ("courses");
            }
            [HttpPost]
            [Route("create")]
            public async Task<IResult> CreateCourse(Course course) {
                if(string.IsNullOrEmpty(course.Code) || string.IsNullOrEmpty(course.Name)) return Results.BadRequest("Course needs a code and name");

                if(courses.Find(c => c.Code.ToLower().Equals(course.Code.ToLower())).ToList().Any()) return Results.BadRequest("That course already exists");
                
                await courses.InsertOneAsync(course);

                return Results.Ok();
            }
            [HttpGet]
            [Route("view")]
            public async Task<IResult> ViewCourses(string? id, string? code) {
                if(string.IsNullOrEmpty(id)) {
                    Course course;
                    try {
                        course = courses.Find(c => c._id == ObjectId.Parse(id)).ToList().First();
                    }
                    catch (Exception _i) {
                        return Results.BadRequest("There was no course with this id");
                    }
                    return Results.Ok(course);
                }
                if(string.IsNullOrEmpty(code)) {
                    List<Course> courseList;
                    try
                    {
                        courseList = courses.Find(c => c.Code.ToLower().Contains(code.ToLower())).ToList();
                    }
                    catch (Exception _i)
                    {
                        return Results.BadRequest("There was an issue");
                    }
                    return Results.Ok(courseList);
                }
                return Results.Ok(courses);
            }
            [HttpPut]
            [Route("update/{id}")]
            public async Task<IResult> UpdateCourse(Course course, string? id) {
                if (string.IsNullOrEmpty(id)) return Results.BadRequest("id was not provided");

                if(!courses.Find(c => c._id == ObjectId.Parse(id)).ToList().Any()) return Results.BadRequest("No course with provided id");
                
                var filter = Builders<Course>.Filter.Eq(a => a._id, ObjectId.Parse(id));

                if (!string.IsNullOrEmpty(course.Name))
                {
                    var update = Builders<Course>.Update.Set(a => a.Name, course.Name);
                    await courses.UpdateOneAsync(filter, update);
                }

                return Results.Ok("Updated");

            }
            [HttpDelete]
            [Route("delete/{id}")]
            public async Task<IResult> DeleteCourse(string? id) {
                if(string.IsNullOrEmpty(id)) return Results.BadRequest("id was not provided");

                if (!courses.Find(c => c._id == ObjectId.Parse(id)).ToList().Any()) return Results.BadRequest("No course with provided id");

                var filter = Builders<Course>.Filter.Eq(s => s._id, ObjectId.Parse(id));
                await courses.DeleteOneAsync(filter);
                return Results.Ok("Course Deleted");
            }
        }
    }
}