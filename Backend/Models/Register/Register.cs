using System;

namespace Backend.Models;

/// <summary>
/// Request model for user registration containing all required user information.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// The role for the new user. Valid values: "player", "manager".
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
    /// The unique username for the account. Must be unique across all users.
    /// </summary>
    public string UserName { get; set; } = null!;

    /// <summary>
    /// The user's email address. Must be unique and valid email format.
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// The password for the account. Will be hashed before storage.
    /// </summary>
    public string Password { get; set; } = null!;

    /// <summary>
    /// The user's date of birth.
    /// </summary>
    public DateTime Dob { get; set; }

    /// <summary>
    /// Optional team ID to assign the user to a team upon registration.
    /// </summary>
    public int? TeamId { get; set; }

    /// <summary>
    /// Optional URL for the user's profile image.
    /// </summary>
    public string? ImageUrl { get; set; }
}

/// <summary>
/// Response model returned after successful registration.
/// Contains user information and JWT token for immediate authentication.
/// </summary>
public class RegisterResponse
{
    /// <summary>
    /// The unique identifier assigned to the new user.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The role assigned to the user.
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
    /// The team ID if the user was assigned to a team.
    /// </summary>
    public int? TeamId { get; set; }

    /// <summary>
    /// The user's profile image URL if provided.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// The JWT token for authenticated API requests.
    /// </summary>
    public string Token { get; set; } = null!;

    /// <summary>
    /// The UTC datetime when the token expires.
    /// </summary>
    public DateTime Expiration { get; set; }
}
