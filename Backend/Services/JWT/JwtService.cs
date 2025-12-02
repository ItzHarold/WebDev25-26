using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class JwtService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public JwtService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;

    }



}