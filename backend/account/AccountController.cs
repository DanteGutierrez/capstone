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
        public class AccountController : ControllerBase
        {
            private readonly IMongoDatabase _db;
            private readonly IMongoCollection<Account> accounts;

            private readonly IDatabase authorization;
            public AccountController(IConfiguration config)
            {
                var client = new MongoClient(config.GetConnectionString("mongo"));
                _db = client.GetDatabase("capstone");
                accounts = _db.GetCollection <Account> ("accounts");

                var _redis = ConnectionMultiplexer.Connect(config.GetConnectionString("redis"));
                authorization = _redis.GetDatabase();
            }
            private async Task<string> GenerateAuthorization(string id) {
                string auth = DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss");

                await authorization.StringGetSetAsync(id, auth);
                await authorization.KeyExpireAsync(id, TimeSpan.FromHours(4));

                return await authorization.StringGetAsync(id);
            }
            private async Task<bool> CheckAuthorization(string? userid, string? auth)
            {
                if (string.IsNullOrEmpty(auth) || string.IsNullOrEmpty(userid)) return false;

                string value = authorization.StringGet(userid);

                if(string.IsNullOrEmpty(value)) return false;

                return value.Equals(auth);
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
                if(account.PreferredCourses != null) {
                    var update = Builders<Account>.Update.Set(a => a.PreferredCourses, account.PreferredCourses);
                    await accounts.UpdateOneAsync(filter, update);
                }
                if(account.Links != null) {
                    var update = Builders<Account>.Update.Set(a => a.Links, account.Links);
                    await accounts.UpdateOneAsync(filter, update);
                }
                var statusUpdate = Builders<Account>.Update.Set(a => a.Status, account.Status);
                await accounts.UpdateOneAsync(filter, statusUpdate);

                var assignedUpdate = Builders<Account>.Update.Set(a => a.AssignedCourse, account.AssignedCourse);
                await accounts.UpdateOneAsync(filter, assignedUpdate);

                var preferredUpdate = Builders<Account>.Update.Set(a => a.PreferredName, account.PreferredName);
                await accounts.UpdateOneAsync(filter, preferredUpdate);

                var profileUpdate = Builders<Account>.Update.Set(a => a.ProfilePictureURL, account.ProfilePictureURL);
                await accounts.UpdateOneAsync(filter, profileUpdate);

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
            public async Task<IResult> CreateAccount(Account account, string? admin, string? auth)
            {
                if(!await CheckAdmin(admin)) return Results.BadRequest("The id provided did not have admin clearance");
                if(!await CheckAuthorization(admin, auth)) return Results.BadRequest("You have invalid authorization");

                if(await InsertAccount(account)) return Results.Ok(account._id.ToString());

                return Results.BadRequest("An account with this email already exists");
            }
            [HttpPut]
            [Route("update/{id}")]
            public async Task<IResult> UpdateAccount(Account account, string? auth, string id, string? admin) {
                if(string.IsNullOrEmpty(id)) return Results.BadRequest("The user id cannot be empty");
                
                if(!await CheckAdmin(admin)) {
                    if(!await CheckAuthorization(id, auth)) return Results.BadRequest("You have invalid authorization");
                }
                else {
                    if(!await CheckAuthorization(admin, auth)) return Results.BadRequest("You have invalid authorization");
                }

                if(!accounts.Find(user => user._id == ObjectId.Parse(id)).ToList().Any()) return Results.BadRequest("The id provided was invalid");
                
                if(!await UpdateTheAccount(account, id)) return Results.BadRequest("The update failed");
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

                string auth = await GenerateAuthorization(user._id.ToString());

                return Results.Ok(new LoginSuccess(user._id.ToString(), auth, user.Admin)); 
            }
            [HttpGet]
            [Route("logout/{id}")]
            public async Task<IResult> Logout(string id) {
                await authorization.KeyDeleteAsync(id);
                return Results.Ok("Logged Out");
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
                return Results.Ok(new LimitedAccount(account._id.ToString(), account.Email, (string.IsNullOrEmpty( account.PreferredName) ? account.FirstName : account.PreferredName) + " " + account.LastName, account.AssignedCourse, account.PreferredCourses, account.ProfilePictureURL, account.Links, account.Status));
            }
            [HttpPost]
            [Route("batch")]
            public async Task<IResult> BatchAccounts(ListAccounts list) {
                List<LimitedAccount> result = new();
                foreach(string id in list.Accounts) {
                    Account account;
                    try {
                        account = accounts.Find(user => user._id == ObjectId.Parse(id)).ToList().First();
                    }
                    catch(Exception _i) {
                        break;
                    }
                    result.Add(new LimitedAccount(account._id.ToString(), account.Email, (string.IsNullOrEmpty(account.PreferredName) ? account.FirstName : account.PreferredName) + " " + account.LastName, account.AssignedCourse, account.PreferredCourses, account.ProfilePictureURL, account.Links, account.Status));
                }
                return Results.Ok(result);
            }
        }
    }
}
