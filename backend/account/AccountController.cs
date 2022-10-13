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
        public class AccountController : ControllerBase
        {
            private readonly IMongoDatabase _db;
            private readonly IMongoCollection<Account> accounts;
            public AccountController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                accounts = _db.GetCollection <Account> ("accounts");
            }
            private async Task<bool> CheckAuthorization(string? userid, string? auth)
            {
                if (string.IsNullOrEmpty(auth) || string.IsNullOrEmpty(userid)) return false;
                return true;
                //TODO redis
            }
            private async Task<bool> CheckAdmin(string? Id) {
                if(string.IsNullOrEmpty(Id)) return false;
                Account admin;
                try
                {
                    admin = accounts.Find(account => account._id == ObjectId.Parse(Id)).ToList().First();
                }
                catch (Exception _i)
                {
                    return false;
                }
                return admin.Admin;
            }
            private async Task<bool> UpdateTheAccount(Account account, string userid)
            {
                var filter = Builders<Account>.Filter.Eq(a => a._id, ObjectId.Parse(userid));

                if(!string.IsNullOrEmpty(account.Password)) 
                {
                    var update = Builders<Account>.Update.Set(a => a.Password, account.Password);
                    await accounts.UpdateOneAsync(filter, update);
                }
                if (!string.IsNullOrEmpty(account.PreferredName))
                {
                    var update = Builders<Account>.Update.Set(a => a.PreferredName, account.PreferredName);
                    await accounts.UpdateOneAsync(filter, update);
                }
                if(!string.IsNullOrEmpty(account.AssignedCourse)) {
                    var update = Builders<Account>.Update.Set(a => a.AssignedCourse, account.AssignedCourse);
                    await accounts.UpdateOneAsync(filter, update);
                }
                if(account.PreferredCourses != null) {
                    var update = Builders<Account>.Update.Set(a => a.PreferredCourses, account.PreferredCourses);
                    await accounts.UpdateOneAsync(filter, update);
                }

                return true;
            }
            private async Task<bool> InsertAccount(Account account)
            {
                if (!accounts.Find(user => user.Email.Equals(account.Email)).ToList().Any())
                {
                    await accounts.InsertOneAsync(account);
                    return true;
                }
                return false;
            }
            [HttpGet]
            [Route("view/{id}")]
            public async Task<IResult> ViewAccount(string? id) {
                Account account;
                try {
                    account = accounts.Find(user => user._id == ObjectId.Parse(id)).ToList().First();
                }
                catch(Exception _i) {
                    return Results.BadRequest("There was no account");
                }
                return Results.Ok(new LimitedAccount(account.PreferredName, account.AssignedCourse, account.PreferredCourses));
            }
            [HttpPost]
            [Route("create")]
            public async Task<IResult> CreateAccount(Account account, string? Id)
            {
                //if(!await CheckAdmin(Id)) return Results.BadRequest("The id provided did not have admin clearance");

                if(await InsertAccount(account)) return Results.Ok(account._id.ToString());

                return Results.BadRequest("An account with this email already exists");
            }
            [HttpPut]
            [Route("update/{userid}")]
            public async Task<IResult> UpdateAccount(Account account, string? auth, string userid) {
                if(!await CheckAuthorization(userid, auth)) return Results.BadRequest("You have invalid authorization");

                if(string.IsNullOrEmpty(userid)) return Results.BadRequest("The user id cannot be empty");

                if(!accounts.Find(user => user._id == ObjectId.Parse(userid)).ToList().Any()) return Results.BadRequest("The id provided was invalid");
                
                if(!await UpdateTheAccount(account, userid)) return Results.BadRequest("The update failed");
                return Results.Ok("Updated");

            }
            [HttpPost]
            [Route("login")]
            public async Task<IResult> Login(Login attempt) {
                if (string.IsNullOrEmpty(attempt.Email) || string.IsNullOrEmpty(attempt.Password)) return Results.BadRequest("Login attempt was invalid");

                Account user;
                try
                {
                    user = accounts.Find(user => user.Email.Equals(attempt.Email) && user.Password.Equals(attempt.Password)).ToList().First();
                }
                catch (Exception _i)
                {
                    return Results.BadRequest("Login attempt failed");
                }
                return Results.Ok( user._id.ToString()); //TODO redis
            }
        }
    }
}
