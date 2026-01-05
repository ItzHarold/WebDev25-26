using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing users.
/// Provides endpoints for CRUD operations on users including profile management and password changes.
/// </summary>
[Authorize]
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the UserController.
    /// </summary>
    /// <param name="userService">The user service for data operations</param>
    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Retrieves all users.
    /// </summary>
    /// <returns>A list of all users</returns>
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

    /// <summary>
    /// Retrieves a specific user by their ID.
    /// </summary>
    /// <param name="id">The unique identifier of the user</param>
    /// <returns>The user if found, NotFound otherwise</returns>
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

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="request">The user data to create</param>
    /// <returns>The created user with its assigned ID</returns>
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create([FromBody] UserRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var user = new User
        {
            Role = request.Role,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            Password = request.Password,
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };
        
        var created = await _userService.CreateAsync(user, userId, userRole);
        
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

    /// <summary>
    /// Updates an existing user.
    /// </summary>
    /// <param name="id">The ID of the user to update</param>
    /// <param name="request">The updated user data</param>
    /// <returns>NoContent if successful, NotFound if user doesn't exist</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var user = new User
        {
            Role = request.Role,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
            Password = request.Password,
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };
        
        var success = await _userService.UpdateAsync(id, user, userId, userRole);
        if (!success) return NotFound();
        return NoContent();
    }

    

    /// <summary>
    /// Deletes a user. Admin only.
    /// </summary>
    /// <param name="id">The ID of the user to delete</param>
    /// <returns>NoContent if successful, NotFound if user doesn't exist</returns>
    [Authorize(Roles = "admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var success = await _userService.DeleteAsync(id, userId, userRole);
        if (!success) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Uploads a profile picture for a user.
    /// </summary>
    /// <param name="request">The upload request containing user ID and image file</param>
    /// <returns>The URL of the uploaded profile picture, or NotFound if user doesn't exist</returns>
    [HttpPost("{id:int}/upload-profile-picture")]
    public async Task<IActionResult> UploadProfilePicture(int id, [FromForm] UserProfilePictureUploadRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int tokenUserId = int.Parse(userIdClaim);

        if (tokenUserId != id && userRole != "admin")
            return Forbid();

        if (request.ImageFile == null || request.ImageFile.Length == 0)
            return BadRequest("No file uploaded.");

        var result = await _userService.UploadProfilePictureAsync(id, request.ImageFile);
        if (result == null)
            return NotFound("User not found.");

        return Ok(new { imageUrl = result });
    }

    /// <summary>
    /// Changes a user's password. Users can only change their own password.
    /// </summary>
    /// <param name="request">The password change request containing user ID, current password, and new password</param>
    /// <returns>NoContent if successful, BadRequest if current password is incorrect, Forbidden if attempting to change another user's password</returns>
    [HttpPut("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        // Get user ID from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();
        int tokenUserId = int.Parse(userIdClaim);

        // Security check: users can only change their own password
        if (tokenUserId != request.UserId)
            return Forbid();

        var success = await _userService.ChangePasswordAsync(
            request.UserId, 
            request.CurrentPassword, 
            request.NewPassword
        );

        if (!success) 
            return BadRequest("Current password is incorrect or user not found");

        return NoContent();
    }
}