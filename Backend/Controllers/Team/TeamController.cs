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
    public async Task<ActionResult<IEnumerable<Team>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // GET /Team/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Team>> GetById(int id)
    {
        var team = await _service.GetByIdAsync(id);
        if (team == null) return NotFound();
        return Ok(team);
    }

    // POST /Team
    [HttpPost]
    public async Task<ActionResult<Team>> Create([FromBody] Team team)
    {
        var created = await _service.CreateAsync(team);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /Team/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Team team)
    {
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