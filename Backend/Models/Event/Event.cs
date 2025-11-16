namespace Backend.Models;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Location { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public string? Detail { get; set; }
    public string Status { get; set; }
    public string? ImageUrl { get; set; }

}
