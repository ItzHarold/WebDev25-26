using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class EventTeamContrller : ControllerBase
{
    private readonly IEventTeamService _service;

    public EventTeamContrller(IEventTeamService service)
    {
        _service = service;
    }

    // GET /EventTeam
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventTeam>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }
    
    // GET /EventTeam/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventTeam>> GetById(int id)
    {
        var eventTeam = await _service.GetByIdAsync(id);
        if (eventTeam == null) return NotFound();
        return Ok(eventTeam);
    }

    //post /EventTeam
    [HttpPost]
    public async Task<ActionResult<EventTeam>> Create([FromBody] EventTeam eventTeam)
    {
        var created = await _service.CreateAsync(eventTeam);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    //put /EventTeam/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EventTeam eventTeam)
    {
        var success = await _service.UpdateAsync(id, eventTeam);
        if (!success) return NotFound();
        return NoContent();
    }

    //delete /EventTeam/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}