namespace Backend.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Location { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public string? Detail { get; set; }
    public string Status { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public ICollection<EventTeam> EventTeams { get; set; } = new List<EventTeam>();
    public ICollection<UserFavourite> FavouritedByUsers { get; set; } = new List<UserFavourite>();
}