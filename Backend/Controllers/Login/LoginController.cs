using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")] 
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _userService.LoginAsync(request.Email, request.Password);
        if (user == null) return Unauthorized("Invalid email or password");

        return Ok(new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Role = user.Role
        });
    }

}