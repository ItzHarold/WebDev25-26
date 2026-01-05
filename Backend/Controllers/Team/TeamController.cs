using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing esports teams.
/// Provides endpoints for CRUD operations on teams.
/// </summary>
[Authorize]
[ApiController]
[Route("[controller]")]
public class TeamController : ControllerBase
{
    private readonly ITeamService _service;

    /// <summary>
    /// Initializes a new instance of the TeamController.
    /// </summary>
    /// <param name="service">The team service for data operations</param>
    public TeamController(ITeamService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all teams.
    /// </summary>
    /// <returns>A list of all teams</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamResponse>>> GetAll()
    {
        var teams = await _service.GetAllAsync();
        var response = teams.Select(t => new TeamResponse
        {
            Id = t.Id,
            Description = t.Description,
            Points = t.Points,
            ImageUrl = t.ImageUrl,
            ManagerId = t.ManagerId
        });
        return Ok(response);
    }

    /// <summary>
    /// Retrieves a specific team by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the team</param>
    /// <returns>The team if found, NotFound otherwise</returns>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeamResponse>> GetById(int id)
    {
        var team = await _service.GetByIdAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        var response = new TeamResponse
        {
            Id = team.Id,
            Description = team.Description,
            Points = team.Points,
            ImageUrl = team.ImageUrl,
            ManagerId = team.ManagerId
        };
        return Ok(response);
    }

    /// <summary>
    /// Creates a new team. Admin and manager roles only.
    /// </summary>
    /// <param name="request">The team data to create</param>
    /// <returns>The created team with its assigned ID</returns>
    [Authorize(Roles = "admin,manager")]
    [HttpPost]
    public async Task<ActionResult<TeamResponse>> Create([FromBody] TeamRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var team = new Team
        {
            Description = request.Description,
            Points = request.Points,
            ImageUrl = request.ImageUrl,
            ManagerId = request.ManagerId
        };
        
        var created = await _service.CreateAsync(team, userId, userRole);
        
        var response = new TeamResponse
        {
            Id = created.Id,
            Description = created.Description,
            Points = created.Points,
            ImageUrl = created.ImageUrl,
            ManagerId = created.ManagerId
        };
        
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
    }

    /// <summary>
    /// Updates an existing team.
    /// </summary>
    /// <param name="id">The ID of the team to update</param>
    /// <param name="request">The updated team data</param>
    /// <returns>NoContent if successful, NotFound if team doesn't exist</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TeamRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var team = new Team
        {
            Description = request.Description,
            Points = request.Points,
            ImageUrl = request.ImageUrl,
            ManagerId = request.ManagerId
        };
        
        var success = await _service.UpdateAsync(id, team, userId, userRole);
        if (!success) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Deletes a team. Admin only.
    /// </summary>
    /// <param name="id">The ID of the team to delete</param>
    /// <returns>NoContent if successful, NotFound if team doesn't exist</returns>
    [Authorize(Roles = "admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        var success = await _service.DeleteAsync(id, userId, userRole);
        if (!success) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Uploads an image for a specific team.
    /// </summary>
    /// <param name="request">The upload request containing team ID and image file</param>
    /// <returns>The URL of the uploaded image, or NotFound if team doesn't exist</returns>
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadTeamImage([FromForm] TeamImageUploadRequest request)
    {
        if (request.ImageUrl == null || request.ImageUrl.Length == 0)
            return BadRequest("No file uploaded.");

        var result = await _service.UploadTeamPictureAsync(id, request.ImageUrl);
        if (result == null)
            return NotFound("Team not found.");

        return Ok(new { imageUrl = result });
    }
}