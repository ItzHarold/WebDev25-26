using Backend.Data;
using Backend.Models;
using Backend.Services;

namespace Backend.Seeding;

public static class DataSeeder
{
    public static void Seed(AppDbContext context, IPasswordService passwordService)
    {
        // Check if data already exists
        if (context.Users.Any())
            return; 
        // models to fill the database with data

        //Create Teams
        var teamA = new Team
        {
            Description = "The red dragons",
            Points = 0,
            ImageUrl = null,
            ManagerId = 0 
        };
        var teamB = new Team
        {
            Description = "The blue sharks",
            Points = 0,
            ImageUrl = null,
            ManagerId = 0
        };

        context.Teams.AddRange(teamA, teamB);
        context.SaveChanges();
        
        
        //Create Users
        var user1 = new User
        {
            Role = "Admin",
            FirstName = "AdminJohn",
            LastName = "Robot",
            UserName = "adminjohn",
            Email = "john@admin.com",
            Password = passwordService.Hash("1234"),
            Dob = new DateTime(1995, 1, 1),
            Team = teamA
        };

        var user2 = new User
        {
            Role = "User",
            FirstName = "Jane",
            LastName = "Smith",
            UserName = "janesmith",
            Email = "jane@test.com",
            Password = passwordService.Hash("1234"),
            Dob = new DateTime(1998, 5, 10),
            Team = teamA
        };

        var user3 = new User
        {
            Role = "User",
            FirstName = "Bob",
            LastName = "Brown",
            UserName = "bobbrown",
            Email = "bob@test.com",
            Password = passwordService.Hash("1234"),
            Dob = new DateTime(2000, 3, 15),
            Team = teamB
        };

        context.Users.AddRange(user1, user2, user3);
        context.SaveChanges();

        teamA.ManagerId = user1.Id;
        teamB.ManagerId = user3.Id;
        context.SaveChanges();
        
        //Create Events
        var event1 = new Event
        {
            Title = "Football Match",
            Location = "Stadium A",
            Date = DateTime.UtcNow.AddDays(7),
            Description = "A thrilling football match between top teams.",
            Detail = "This match will feature the best players from Team A and Team B.",
            Status = "Active",
            ImageUrl = "https://example.com/football-match.jpg"
        };

        var event2 = new Event
        {
            Title = "Basketball Tournament",
            Location = "Arena B",
            Date = DateTime.UtcNow.AddDays(14),
            Description = "An exciting basketball tournament.",
            Detail = "Teams will compete for the championship title.",
            Status = "Active",
            ImageUrl = "https://example.com/basketball-tournament.jpg"
        };

        var event3 = new Event
        {
            Title = "Tennis Championship",
            Location = "Court C",
            Date = DateTime.UtcNow.AddDays(21),
            Description = "A grand tennis championship.",
            Detail = "Top players will compete for the title.",
            Status = "Upcoming",
            ImageUrl = "https://example.com/tennis-championship.jpg"
        };

        var event4 = new Event
        {
            Title = "Swimming Gala",
            Location = "Pool D",
            Date = DateTime.UtcNow.AddDays(28),
            Description = "A spectacular swimming event.",
            Detail = "Swimmers from all over the country will participate.",
            Status = "Upcoming",
            ImageUrl = "https://example.com/swimming-gala.jpg"
        };

        var event5 = new Event
        {
            Title = "Marathon",
            Location = "City Center",
            Date = DateTime.UtcNow.AddDays(-5),
            Description = "A city-wide marathon.",
            Detail = "Participants ran through the city streets.",
            Status = "Ended",
            ImageUrl = "https://example.com/marathon.jpg"
        };

        var event6 = new Event
        {
            Title = "Cycling Race",
            Location = "Mountain Trail",
            Date = DateTime.UtcNow.AddDays(-10),
            Description = "An adventurous cycling race.",
            Detail = "Cyclists raced through challenging mountain trails.",
            Status = "Ended",
            ImageUrl = "https://example.com/cycling-race.jpg"
        };

        var event7 = new Event
        {
            Title = "Chess Tournament",
            Location = "Hall E",
            Date = DateTime.UtcNow,
            Description = "A strategic chess tournament.",
            Detail = "Players are competing in a knockout format.",
            Status = "Live",
            ImageUrl = "https://example.com/chess-tournament.jpg"
        };

        var event8 = new Event
        {
            Title = "Music Festival",
            Location = "Open Grounds",
            Date = DateTime.UtcNow,
            Description = "A lively music festival.",
            Detail = "Bands and artists are performing live.",
            Status = "Live",
            ImageUrl = "https://example.com/music-festival.jpg"
        };

        context.Events.AddRange(event1, event2, event3, event4, event5, event6, event7, event8);
        context.SaveChanges();

        //Create UserFavourites
        var fav1 = new UserFavourite
        {
            UserId = user1.Id,
            EventId = event1.Id
        };

        var fav2 = new UserFavourite
        {
            UserId = user2.Id,
            EventId = event1.Id
        };

        context.UserFavourites.AddRange(fav1, fav2);
        context.SaveChanges();
        
        //Create EventTeams
        var et1 = new EventTeam
        {
            EventId = event1.Id,
            TeamId = teamA.Id
        };

        var et2 = new EventTeam
        {
            EventId = event1.Id,
            TeamId = teamB.Id
        };

        var et3 = new EventTeam
        {
            EventId = event2.Id,
            TeamId = teamB.Id
        };

        context.EventTeams.AddRange(et1, et2, et3);
        context.SaveChanges();
    }
}
