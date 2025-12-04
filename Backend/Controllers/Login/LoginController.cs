using Backend.Models;
using Backend.Services;
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

    

}