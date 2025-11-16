namespace Backend.Models;

public class User
{
    public int Id { get; set; }
    public string Role { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public DateTime Dob { get; set; }
    public int? TeamId { get; set; }
    public Team? Team { get; set; }
    public string? ImageUrl { get; set; }
    public ICollection<UserFavourite> Favourites { get; set; } = new List<UserFavourite>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}