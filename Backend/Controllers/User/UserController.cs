using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // GET /User
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAll()
    {
        var users = await _userService.GetAllAsync();
        var response = users.Select(u => new UserResponse
        {
            Id = u.Id,
            Role = u.Role,
            FirstName = u.FirstName,
            LastName = u.LastName,
            UserName = u.UserName,
            Email = u.Email,
            Dob = u.Dob,
            TeamId = u.TeamId,
            ImageUrl = u.ImageUrl,
            CreatedAt = u.CreatedAt,
            LastLoginAt = u.LastLoginAt
        });
        return Ok(response);
    }

    // GET /User/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound();
        
        var response = new UserResponse
        {
            Id = user.Id,
            Role = user.Role,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Dob = user.Dob,
            TeamId = user.TeamId,
            ImageUrl = user.ImageUrl,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        };
        return Ok(response);
    }

    // POST /User
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create([FromBody] UserRequest request)
    {
        var user = new User
        {
            Role = request.Role,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            Password = request.Password, // TODO: Hash password before saving
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };
        
        var created = await _userService.CreateAsync(user);
        
        var response = new UserResponse
        {
            Id = created.Id,
            Role = created.Role,
            FirstName = created.FirstName,
            LastName = created.LastName,
            UserName = created.UserName,
            Email = created.Email,
            Dob = created.Dob,
            TeamId = created.TeamId,
            ImageUrl = created.ImageUrl,
            CreatedAt = created.CreatedAt,
            LastLoginAt = created.LastLoginAt
        };
        
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
    }

    // PUT /User/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserRequest request)
    {
        var user = new User
        {
            Role = request.Role,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            Password = request.Password, // TODO: Hash password before saving
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };
        
        var success = await _userService.UpdateAsync(id, user);
        if (!success) return NotFound();
        return NoContent();
    }

    // DELETE /User/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _userService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}