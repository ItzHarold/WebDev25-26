using Microsoft.EntityFrameworkCore;
using Backend.Models;
namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<UserFavourite> UserFavourites { get; set; }
        public DbSet<EventTeam> EventTeams { get; set; }
        public DbSet<Logger> Loggers { get; set; }
    }
}
