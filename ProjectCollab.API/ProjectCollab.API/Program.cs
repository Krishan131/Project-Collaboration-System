using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ProjectCollab.API.Hubs;
using ProjectCollab.API.Models;

var builder = WebApplication.CreateBuilder(args);

// CORS policy name
const string CorsPolicy = "AllowClientOrigins";

// Add services to the container.
builder.Services.AddDbContext<ProjectCollabContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSignalR();

// Add CORS - allow specific origins (required for SignalR if using credentials)
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:4200") // change to your client URL(s)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseHttpsRedirection();

// Enable CORS BEFORE authorization and endpoint mapping
app.UseCors(CorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.MapHub<ProjectHub>("/projectHub");

app.Run();
