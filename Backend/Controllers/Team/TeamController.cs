using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;
[Authorize]
[ApiController]
[Route("[controller]")]
public class TeamController : ControllerBase
{
    private readonly ITeamService _service;

    public TeamController(ITeamService service)
    {
        _service = service;
    }

    // GET /Team
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

    // GET /Team/{id}
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

    // POST /Team
    [HttpPost]
    public async Task<ActionResult<TeamResponse>> Create([FromBody] TeamRequest request)
    {
        var team = new Team
        {
            Description = request.Description,
            Points = request.Points,
            ImageUrl = request.ImageUrl,
            ManagerId = request.ManagerId
        };
        
        var created = await _service.CreateAsync(team);
        
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

    // PUT /Team/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TeamRequest request)
    {
        var team = new Team
        {
            Description = request.Description,
            Points = request.Points,
            ImageUrl = request.ImageUrl,
            ManagerId = request.ManagerId
        };
        
        var success = await _service.UpdateAsync(id, team);
        if (!success) return NotFound();
        return NoContent();
    }

    // DELETE /Team/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}