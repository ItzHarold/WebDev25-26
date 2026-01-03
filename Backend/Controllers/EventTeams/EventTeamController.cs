using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;
[Authorize]
[ApiController]
[Route("[controller]")]
public class EventTeamController : ControllerBase
{
    private readonly IEventTeamService _service;

    public EventTeamController(IEventTeamService service)
    {
        _service = service;
    }

    // GET /EventTeam
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

    // GET /EventTeam/{id}
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

    // POST /EventTeam
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

    // PUT /EventTeam/{id}
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

    // DELETE /EventTeam/{id}
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
