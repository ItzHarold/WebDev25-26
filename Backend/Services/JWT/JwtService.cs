using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;


namespace Backend.Services;

/// <summary>
/// Service responsible for JWT token generation and user authentication.
/// Handles credential validation and token creation using configured JWT settings.
/// </summary>
public class JwtService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IPasswordService _passwordService;

    /// <summary>
    /// Initializes a new instance of the JwtService.
    /// </summary>
    /// <param name="context">Database context for user lookup</param>
    /// <param name="configuration">Application configuration containing JWT settings</param>
    /// <param name="passwordService">Service for password hashing and verification</param>
    public JwtService(AppDbContext context, IConfiguration configuration, IPasswordService passwordService)
    {
        _dbContext = context;
        _configuration = configuration;
        _passwordService = passwordService;
    }

    /// <summary>
    /// Authenticates a user and generates a JWT token.
    /// </summary>
    /// <param name="request">Login credentials containing email and password</param>
    /// <returns>
    /// A LoginResponse containing the JWT token and user info if authentication succeeds,
    /// or null if credentials are invalid.
    /// </returns>
    /// <remarks>
    /// This method performs the following steps:
    /// 1. Validates input is not empty
    /// 2. Looks up user by email in database
    /// 3. Verifies password hash matches
    /// 4. Updates LastLoginAt timestamp
    /// 5. Generates JWT token with user claims (Id, Email, Role)
    /// </remarks>
    public async Task<LoginResponse?> Authenticate(LoginRequest request)
    {
        // Controleren van de input van de gebruiker
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return null;
        // Opzoeken van de gebruiker in de database en verifieren van het wachtwoord
        var User = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
        if (User is null || !_passwordService.Verify(User.Password, request.Password))
            return null;

        // Update LastLoginAt timestamp
        User.LastLoginAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        // JWT Configuratie ophalen
        var issuer = _configuration["JwtConfig:Issuer"];
        var audience = _configuration["JwtConfig:Audience"];
        var key = _configuration["JwtConfig:Key"];
        var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityInMinutes");

        // Aanmaken van claims voor de token
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, User.Id.ToString()),
            new Claim(ClaimTypes.Email, User.Email),
            new Claim(ClaimTypes.Role, User.Role)
        };

        var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key!));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        // Token genereren
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(tokenValidityMins),
            signingCredentials: credentials
        );

        // Convert token to string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return new LoginResponse
        {
            UserId = User.Id,
            Email = User.Email,
            Role = User.Role,
            Token = tokenString,
            Expiration = token.ValidTo
        };
    }
}