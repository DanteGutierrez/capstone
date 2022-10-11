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
                accounts = _db.GetCollection <Account> ("");
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
                    var passwordUpdate = Builders<Account>.Update.Set(a => a.Password, account.Password);
                    await accounts.UpdateOneAsync(filter, passwordUpdate);
                }
                if (!string.IsNullOrEmpty(account.PreferredName))
                {
                    var preferredNameUpdate = Builders<Account>.Update.Set(a => a.PreferredName, account.PreferredName);
                    await accounts.UpdateOneAsync(filter, preferredNameUpdate);
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
            [HttpPost]
            [Route("create")]
            public async Task<IResult> CreateAccount(Account account, string? Id)
            {
                if(!await CheckAdmin(Id)) return Results.BadRequest("The id provided did not have admin clearance");

                if(await InsertAccount(account)) return Results.Ok(account._id.ToString());

                return Results.BadRequest("An account with this email already exists");
            }
            [HttpPut]
            [Route("update/{userid}")]
            public async Task<IResult> UpdateAccount(Account account, string? auth, string userid) {
                if(!await CheckAuthorization(userid, auth)) return Results.BadRequest("You have invalid authorization");

                if(string.IsNullOrEmpty(userid)) return Results.BadRequest("The user id cannot be empty");
                Account user;

                try {
                    user = accounts.Find(user => user._id == ObjectId.Parse(userid)).ToList().First();
                }
                catch(Exception _i) {
                    return Results.BadRequest("The id provided was invalid");
                }
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
