using System;

namespace Backend.Models;

public class RegisterRequest
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

public class RegisterResponse
{
    public int UserId { get; set; }

    public string Role { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime Dob { get; set; }

    public int? TeamId { get; set; }

    public string? ImageUrl { get; set; }

    public string Token { get; set; } = null!;

    public DateTime Expiration { get; set; }
}
