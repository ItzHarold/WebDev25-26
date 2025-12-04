namespace Backend.Models;

public class UserFavourite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;
}

public class UserFavouriteRequest
{
    public int UserId { get; set; }
    public int EventId { get; set; }
}


public class UserFavouriteResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
}