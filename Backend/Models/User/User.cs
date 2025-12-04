using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

[Index(nameof(UserName), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    public int Id { get; set; }

    [Required]
    public string Role { get; set; } = null!;

    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    [Column(TypeName = "TEXT COLLATE NOCASE")]
    public string UserName { get; set; } = null!;

    [Required]
    [EmailAddress]
    [Column(TypeName = "TEXT COLLATE NOCASE")]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;

    public DateTime Dob { get; set; }

    public int? TeamId { get; set; }
    public Team? Team { get; set; }

    public string? ImageUrl { get; set; }

    public ICollection<UserFavourite> Favourites { get; set; } = new List<UserFavourite>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}

public class UserRequest
{ 
    public string Role { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public DateTime Dob { get; set; }
    public int? TeamId { get; set; }
    public string? ImageUrl { get; set; }
}

public class UserResponse
{ 
    public int Id { get; set; }
    public string Role { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime Dob { get; set; }
    public int? TeamId { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}