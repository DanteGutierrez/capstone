using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;
using Steeltoe.Common.Discovery;
using Steeltoe.Discovery.Eureka;
using Steeltoe.Discovery;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDiscoveryClient(builder.Configuration);
var Origins = "_OriginsAllowed";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: Origins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000", "http://localhost:8888")
                          .WithHeaders(HeaderNames.ContentType, "application/json", HeaderNames.AccessControlAllowOrigin, "*")
                          .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
                      });
});

var app = builder.Build();

app.MapControllers();
app.UseCors(Origins);

app.MapGet("/", () => "Account Working!");

app.Run();
