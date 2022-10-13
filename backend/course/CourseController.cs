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
            private readonly IMongoCollection<Course> collection;
            public CourseController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                collection = _db.GetCollection <Course> ("courses");
            }
        }
    }
}