using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _service;

    public EventController(IEventService service)
    {
        _service = service;
    }

    // GET /Event
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    // GET /Event/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Event>> GetById(int id)
    {
        var ev = await _service.GetByIdAsync(id);
        if (ev == null) return NotFound();
        return Ok(ev);
    }

    // POST /Event
    [HttpPost]
    public async Task<ActionResult<Event>> Create([FromBody] Event ev)
    {
        var created = await _service.CreateAsync(ev);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /Event/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Event ev)
    {
        var success = await _service.UpdateAsync(id, ev);
        if (!success) return NotFound();
        return NoContent();
    }

    // DELETE /Event/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}