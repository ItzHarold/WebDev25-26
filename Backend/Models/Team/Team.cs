namespace Backend.Models;

public class Team
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public int Points { get; set; }
    public string? ImageUrl { get; set; }
    public int ManagerId { get; set; }
    public ICollection<User> Players { get; set; } = new List<User>();
    public ICollection<EventTeam> EventTeams { get; set; } = new List<EventTeam>();
}

public class TeamRequest
{
    public string? Description { get; set; }
    public int Points { get; set; }
    public string? ImageUrl { get; set; }
    public int ManagerId { get; set; }
}

public class TeamResponse
{
    public int Id { get; set; }
    public string? Description { get; set; }
    public int Points { get; set; }
    public string? ImageUrl { get; set; }
    public int ManagerId { get; set; }
}