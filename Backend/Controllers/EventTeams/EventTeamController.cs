using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing event-team associations.
/// Provides endpoints for CRUD operations on event-team relationships.
/// </summary>
[Authorize]
[ApiController]
[Route("[controller]")]
public class EventTeamController : ControllerBase
{
    private readonly IEventTeamService _service;

    /// <summary>
    /// Initializes a new instance of the EventTeamController.
    /// </summary>
    /// <param name="service">The event-team service for data operations</param>
    public EventTeamController(IEventTeamService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all event-team associations.
    /// </summary>
    /// <returns>A list of all event-team relationships including full event and team details</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventTeamResponse>>> GetAll()
    {
        List<EventTeam> eventTeams = await _service.GetAllAsync();

        var response = eventTeams.Select(et => new EventTeamResponse
        {
            Id = et.Id,
            Event = new EventResponse
            {
                Id = et.Event!.Id,
                Title = et.Event.Title,
                Location = et.Event.Location,
                Date = et.Event.Date,
                Description = et.Event.Description,
                Detail = et.Event.Detail,
                Status = et.Event.Status,
                ImageUrl = et.Event.ImageUrl
            },
            Team = new TeamResponse
            {
                Id = et.Team!.Id,
                Description = et.Team.Description,
                Points = et.Team.Points,
                ImageUrl = et.Team.ImageUrl,
                ManagerId = et.Team.ManagerId
            }
        });

        return Ok(response);
    }

    /// <summary>
    /// Retrieves a specific event-team association by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the event-team association</param>
    /// <returns>The event-team relationship if found, NotFound otherwise</returns>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventTeamResponse>> GetById(int id)
    {
        EventTeam? et = await _service.GetByIdAsync(id);
        if (et == null)
        {
            return NotFound();
        }

        EventTeamResponse response = new EventTeamResponse
        {
            Id = et.Id,
            Event = new EventResponse
            {
                Id = et.Event!.Id,
                Title = et.Event.Title,
                Location = et.Event.Location,
                Date = et.Event.Date,
                Description = et.Event.Description,
                Detail = et.Event.Detail,
                Status = et.Event.Status,
                ImageUrl = et.Event.ImageUrl
            },
            Team = new TeamResponse
            {
                Id = et.Team!.Id,
                Description = et.Team.Description,
                Points = et.Team.Points,
                ImageUrl = et.Team.ImageUrl,
                ManagerId = et.Team.ManagerId
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// Creates a new event-team association.
    /// </summary>
    /// <param name="request">The event-team association data containing event ID and team ID</param>
    /// <returns>The created event-team relationship with full details</returns>
    [HttpPost]
    public async Task<ActionResult<EventTeamResponse>> Create([FromBody] EventTeamRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        EventTeam entity = new EventTeam
        {
            EventId = request.EventId,
            TeamId = request.TeamId
        };

        EventTeam created = await _service.CreateAsync(entity, userId, userRole);

        var et = await _service.GetByIdAsync(created.Id);
        if (et == null)
        {
            return NotFound();
        }

        EventTeamResponse response = new EventTeamResponse
        {
            Id = et.Id,
            Event = new EventResponse
            {
                Id = et.Event!.Id,
                Title = et.Event.Title,
                Location = et.Event.Location,
                Date = et.Event.Date,
                Description = et.Event.Description,
                Detail = et.Event.Detail,
                Status = et.Event.Status,
                ImageUrl = et.Event.ImageUrl
            },
            Team = new TeamResponse
            {
                Id = et.Team!.Id,
                Description = et.Team.Description,
                Points = et.Team.Points,
                ImageUrl = et.Team.ImageUrl,
                ManagerId = et.Team.ManagerId
            }
        };

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    /// <summary>
    /// Updates an existing event-team association.
    /// </summary>
    /// <param name="id">The ID of the event-team association to update</param>
    /// <param name="request">The updated event-team data</param>
    /// <returns>NoContent if successful, NotFound if association doesn't exist</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EventTeamRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        EventTeam data = new EventTeam
        {
            EventId = request.EventId,
            TeamId = request.TeamId
        };

        bool success = await _service.UpdateAsync(id, data, userId, userRole);
        if (!success) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Deletes an event-team association. Manager and admin roles only.
    /// </summary>
    /// <param name="id">The ID of the event-team association to delete</param>
    /// <returns>NoContent if successful, NotFound if association doesn't exist</returns>
    [Authorize(Roles = "manager,admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

        bool success = await _service.DeleteAsync(id, userId, userRole);
        if (!success) return NotFound();
        return NoContent();
    }
}
