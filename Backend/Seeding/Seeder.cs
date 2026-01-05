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
            Description = "The Tetris Titans",
            Points = 50,
            ManagerId = 0,
            ImageUrl = "/team-pictures/demon.jpg" 
        };

        var teamB = new Team
        {
            Description = "The Minecraft Miners",
            Points = 40,
            ManagerId = 0,
            ImageUrl = "/team-pictures/fox.jpg" 
        };

        var teamC = new Team
        {
            Description = "The Fortnite Fighters",
            Points = 60,
            ManagerId = 0,
            ImageUrl = "/team-pictures/goat.jpg"
        };

        var teamD = new Team
        {
            Description = "The Overwatch Outlaws",
            Points = 30,
            ManagerId = 0,
            ImageUrl = "/team-pictures/storm.jpg"
        };

        var teamE = new Team
        {
            Description = "The League Legends",
            Points = 70,
            ManagerId = 0,
            ImageUrl = "/team-pictures/wolf.jpg"
        };

        context.Teams.AddRange(teamA, teamB, teamC, teamD, teamE);
        context.SaveChanges();
        
        
        //Create Users
        var user1 = new User
        {
            Role = "admin",
            FirstName = "John",
            LastName = "Smith",
            UserName = "adminjohn",
            Email = "admin@test.com",
            Password = passwordService.Hash("123456"),
            Dob = new DateTime(1995, 1, 1),
            Team = teamA
        };

        var user2 = new User
        {
            Role = "player",
            FirstName = "Jane",
            LastName = "Smith",
            UserName = "playerJane",
            Email = "player@test.com",
            Password = passwordService.Hash("123456"),
            Dob = new DateTime(1998, 5, 10),
            Team = teamA
        };

        var user3 = new User
        {
            Role = "manager",
            FirstName = "Bob",
            LastName = "Brown",
            UserName = "managerBob",
            Email = "manager@test.com",
            Password = passwordService.Hash("123456"),
            Dob = new DateTime(2000, 3, 15),
            Team = teamB
        };

        context.Users.AddRange(user1, user2, user3);
        context.SaveChanges();

        teamA.ManagerId = user1.Id;
        teamB.ManagerId = user3.Id;
        teamC.ManagerId = user3.Id;
        teamD.ManagerId = user3.Id;
        teamE.ManagerId = user3.Id;

        context.SaveChanges();
        
        //Create Events
        var event1 = new Event
        {
            Title = "Tetris World Championship",
            Location = "Stadium A",
            Date = DateTime.UtcNow.AddDays(7),
            Description = "The ultimate Tetris showdown.",
            Detail = "Players from around the world compete for the Tetris crown.",
            Status = "Active",
            ImageUrl = "/event-pictures/tetris.jpg"
            
        };

        var event2 = new Event
        {
            Title = "Minecraft Build Battle",
            Location = "Arena B",
            Date = DateTime.UtcNow.AddDays(14),
            Description = "A creative Minecraft competition.",
            Detail = "Teams compete to build the most impressive structures.",
            Status = "Active",
            ImageUrl = "/event-pictures/minecraft.jpg"
        };

        var event3 = new Event
        {
            Title = "Fortnite Battle Royale",
            Location = "Court C",
            Date = DateTime.UtcNow.AddDays(21),
            Description = "A thrilling Fortnite tournament.",
            Detail = "Top players battle it out in the ultimate survival game.",
            Status = "Upcoming",
            ImageUrl = "/event-pictures/fortnite.jpg"
        };

        var event4 = new Event
        {
            Title = "Overwatch League Finals",
            Location = "Pool D",
            Date = DateTime.UtcNow.AddDays(28),
            Description = "The grand finale of the Overwatch League.",
            Detail = "The best teams compete for the championship title.",
            Status = "Upcoming",
            ImageUrl = "/event-pictures/overwatch.jpg"
        };

        var event5 = new Event
        {
            Title = "League of Legends Worlds",
            Location = "City Center",
            Date = DateTime.UtcNow.AddDays(-5),
            Description = "The biggest League of Legends tournament.",
            Detail = "Teams from all regions compete for the Summoner's Cup.",
            Status = "Ended",
            ImageUrl = "/event-pictures/lol.jpg"
        };

        var event6 = new Event
        {
            Title = "Valorant Champions Tour",
            Location = "Mountain Trail",
            Date = DateTime.UtcNow.AddDays(-10),
            Description = "The premier Valorant tournament.",
            Detail = "Top teams showcase their skills in tactical FPS gameplay.",
            Status = "Ended",
            ImageUrl = "/event-pictures/valorant.jpg"
        };

        var event7 = new Event
        {
            Title = "Chess Masters Invitational",
            Location = "Hall E",
            Date = DateTime.UtcNow,
            Description = "A strategic chess tournament.",
            Detail = "Players compete in a knockout format.",
            Status = "Live",
            ImageUrl = "/event-pictures/chess.jpg"
        };

        var event8 = new Event
        {
            Title = "Clash Royale",
            Location = "Open Grounds",
            Date = DateTime.UtcNow,
            Description = "A lively Clash Royale tournament.",
            Detail = "Players compete in fast-paced battles.",
            Status = "Live",
            ImageUrl = "/event-pictures/clash.jpg"
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
