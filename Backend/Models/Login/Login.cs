namespace Backend.Models;

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginResponse
{
    public int UserId { get; set; }
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
}