using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class JwtService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public JwtService(AppDbContext context, IConfiguration configuration)
    {
        _dbContext = context;
        _configuration = configuration;

    }

    /*public async Task<LoginResponse?> Authenticate(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return null;
        var User = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
        if (User is null || !PasswordService.Verify(User.Password, request.Password))
            return null;
        var issuer = _configuration["JwtConfig:Issuer"];
        var audience = _configuration["JwtConfig:Audience"];
        var key = _configuration["JwtConfig:Key"];
        var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
        how

    }*/



}