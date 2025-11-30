using Clinic_CRM.ApplicationDbContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});  

var app = builder.Build();

//Build Migration database update
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<Context>();
        var pending = db.Database.GetPendingMigrations();

        if (pending != null && pending.Any())
        {
            logger.LogInformation("Applying {Count} pending migrations...", pending.Count());
            db.Database.Migrate();   // <-- applies migrations
        }
        else
        {
            logger.LogInformation("No pending migrations. Database is up to date.");
        }
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "An error occurred while migrating the database.");
        throw;
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
