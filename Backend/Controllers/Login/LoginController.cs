using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtService _jwtService;

    public AuthController(IUserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [AllowAnonymous]
    [HttpPost("login")] 
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var result = await _jwtService.Authenticate(request);
        if(result == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }
        return result;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.UserName) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.Role))
        {
            return BadRequest(new { message = "Missing required fields." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var userName = request.UserName.Trim();

        var emailExists = await _userService.Users().AnyAsync(u => u.Email.ToLower() == email);
        if (emailExists) return BadRequest(new { message = "Email already in use." });

        var userNameExists = await _userService.Users().AnyAsync(u => u.UserName.ToLower() == userName.ToLower());
        if (userNameExists) return BadRequest(new { message = "Username already in use." });

        var created = await _userService.CreateUser(request);
        if (!created) return BadRequest(new { message = "Could not create user." });

        var loginResult = await _jwtService.Authenticate(new LoginRequest
        {
            Email = request.Email,
            Password = request.Password
        });

        if (loginResult == null) return BadRequest(new { message = "Registration succeeded but login failed." });

        return new RegisterResponse
        {
            UserId = loginResult.UserId,
            Email = loginResult.Email,
            Role = loginResult.Role,
            Token = loginResult.Token,
            Expiration = loginResult.Expiration,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };
    }

        

}