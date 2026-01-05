namespace Backend.Models;

/// <summary>
/// Request model for user login containing credentials.
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// The user's email address used for authentication.
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// The user's password in plain text (will be verified against stored hash).
    /// </summary>
    public string Password { get; set; } = null!;
}

/// <summary>
/// Response model returned after successful authentication.
/// Contains JWT token and basic user information.
/// </summary>
public class LoginResponse
{
    /// <summary>
    /// The unique identifier of the authenticated user.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The email address of the authenticated user.
    /// </summary>
    public string Email { get; set; } = null!;

    /// <summary>
    /// The role of the user (e.g., "admin", "manager", "player").
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// The JWT token to be used for authenticated API requests.
    /// Include this in the Authorization header as "Bearer {token}".
    /// </summary>
    public string Token { get; set; } = null!;

    /// <summary>
    /// The UTC datetime when the token expires.
    /// </summary>
    public DateTime Expiration { get; set; }
}