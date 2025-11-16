namespace Backend.Models.Team;

public class Team
{
    public int Id { get; set; }  
    public string? Description { get; set; }
    public int Points { get; set; }
    public string? ImageUrl { get; set; }
    public int Manager { get; set;} 
}