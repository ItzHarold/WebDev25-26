using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

/// <summary>
/// Entity model representing a user in the system.
/// Users can have roles like admin, manager, or player.
/// </summary>
[Index(nameof(UserName), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    /// <summary>
    /// Unique identifier for the user.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The user's role in the system (e.g., "admin", "manager", "player").
    /// </summary>
    [Required]
    public string Role { get; set; } = null!;

    /// <summary>
    /// The user's first name.
    /// </summary>
    [Required]
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// The user's last name.
    /// </summary>
    [Required]
    public string LastName { get; set; } = null!;

    /// <summary>
    /// The user's unique username. Case-insensitive.
    /// </summary>
    [Required]
    [Column(TypeName = "TEXT COLLATE NOCASE")]
    public string UserName { get; set; } = null!;

    /// <summary>
    /// The user's email address. Must be unique and case-insensitive.
    /// </summary>
    [Required]
    [EmailAddress]
    [Column(TypeName = "TEXT COLLATE NOCASE")]
    public string Email { get; set; } = null!;

    /// <summary>
    /// The user's hashed password. Never stored in plain text.
    /// </summary>
    [Required]
    public string Password { get; set; } = null!;

    /// <summary>
    /// The user's date of birth.
    /// </summary>
    public DateTime Dob { get; set; }

    /// <summary>
    /// The ID of the team the user belongs to. Null if not assigned to a team.
    /// </summary>
    public int? TeamId { get; set; }

    /// <summary>
    /// Navigation property for the user's team.
    /// </summary>
    public Team? Team { get; set; }

    /// <summary>
    /// URL to the user's profile picture.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Navigation property for events the user has favourited.
    /// </summary>
    public ICollection<UserFavourite> Favourites { get; set; } = new List<UserFavourite>();

    /// <summary>
    /// Timestamp when the user account was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Timestamp of the user's last successful login. Null if never logged in.
    /// </summary>
    public DateTime? LastLoginAt { get; set; }
}

/// <summary>
/// Request model for creating or updating a user.
/// </summary>
public class UserRequest
{
    /// <summary>
    /// The user's role (e.g., "admin", "manager", "player").
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// The user's first name.
    /// </summary>
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// The user's last name.
    /// </summary>
    public string LastName { get; set; } = null!;

    /// <summary>
    /// The user's unique username.
    /// </summary>
    public string UserName { get; set; } = null!;

    /// <summary>
    /// The user's email address.
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// The user's password (will be hashed before storage).
    /// </summary>
    public string Password { get; set; } = null!;

    /// <summary>
    /// The user's date of birth.
    /// </summary>
    public DateTime Dob { get; set; }

    /// <summary>
    /// Optional team ID to assign the user to.
    /// </summary>
    public int? TeamId { get; set; }

    /// <summary>
    /// Optional URL to the user's profile picture.
    /// </summary>
    public string? ImageUrl { get; set; }
}

/// <summary>
/// Response model containing user data returned from API endpoints.
/// Note: Password is never included in responses.
/// </summary>
public class UserResponse
{
    /// <summary>
    /// Unique identifier for the user.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The user's role in the system.
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// The user's first name.
    /// </summary>
    public string FirstName { get; set; } = null!;

    /// <summary>
    /// The user's last name.
    /// </summary>
    public string LastName { get; set; } = null!;

    /// <summary>
    /// The user's unique username.
    /// </summary>
    public string UserName { get; set; } = null!;

    /// <summary>
    /// The user's email address.
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// The user's date of birth.
    /// </summary>
    public DateTime Dob { get; set; }

    /// <summary>
    /// The ID of the team the user belongs to.
    /// </summary>
    public int? TeamId { get; set; }

    /// <summary>
    /// URL to the user's profile picture.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Timestamp when the user account was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Timestamp of the user's last successful login.
    /// </summary>
    public DateTime? LastLoginAt { get; set; }
}

/// <summary>
/// Request model for uploading a user's profile picture.
/// </summary>
public class UserProfilePictureUploadRequest
{
    /// <summary>
    /// The ID of the user to update the profile picture for.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The image file to upload as profile picture.
    /// </summary>
    public IFormFile? ImageFile { get; set; }
}

/// <summary>
/// Request model for changing a user's password.
/// </summary>
public class ChangePasswordRequest
{
    /// <summary>
    /// The ID of the user changing their password.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The user's current password for verification.
    /// </summary>
    public string CurrentPassword { get; set; } = null!;

    /// <summary>
    /// The new password to set (will be hashed before storage).
    /// </summary>
    public string NewPassword { get; set; } = null!;
}
