using Microsoft.EntityFrameworkCore;
using Backend.Models.User;
using Backend.Models.Team;
using Backend.Models.Event;
using Backend.Models.TeamPlayers;
using Backend.Models.UserFavourites;
using Backend.Models.EventTeams;
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
        public DbSet<TeamPlayer> TeamPlayers { get; set; }
        public DbSet<EventTeam> EventTeams { get; set; }
    }
}
