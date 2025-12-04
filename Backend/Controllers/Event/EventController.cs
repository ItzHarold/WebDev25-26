using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;
[Authorize]
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
    public async Task<ActionResult<IEnumerable<EventResponse>>> GetAll()
    {
        List<Event> events = await _service.GetAllAsync();
        var response = events.Select(e => new EventResponse
        {
            Id = e.Id,
            Title = e.Title,
            Location = e.Location,
            Date = e.Date,
            Description = e.Description,
            Detail = e.Detail,
            Status = e.Status,
            ImageUrl = e.ImageUrl
        });
        return Ok(response);
    }

    // GET /Event/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventResponse>> GetById(int id)
    {
        Event? ev = await _service.GetByIdAsync(id);
        if (ev == null)
        {
            return NotFound();
        }

        EventResponse response = new EventResponse
        {
            Id = ev.Id,
            Title = ev.Title,
            Location = ev.Location,
            Date = ev.Date,
            Description = ev.Description,
            Detail = ev.Detail,
            Status = ev.Status,
            ImageUrl = ev.ImageUrl
        };

        return Ok(response);
    }

    // POST /Event
    [HttpPost]
    public async Task<ActionResult<EventResponse>> Create([FromBody] EventRequest request)
    {
        Event ev = new Event
        {
            Title = request.Title,
            Location = request.Location,
            Date = request.Date,
            Description = request.Description,
            Detail = request.Detail,
            Status = request.Status,
            ImageUrl = request.ImageUrl
        };

        Event created = await _service.CreateAsync(ev);

        EventResponse response = new EventResponse
        {
            Id = created.Id,
            Title = created.Title,
            Location = created.Location,
            Date = created.Date,
            Description = created.Description,
            Detail = created.Detail,
            Status = created.Status,
            ImageUrl = created.ImageUrl
        };

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, response);
    }

    // PUT /Event/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EventRequest request)
    {
        Event ev = new Event
        {
            Title = request.Title,
            Location = request.Location,
            Date = request.Date,
            Description = request.Description,
            Detail = request.Detail,
            Status = request.Status,
            ImageUrl = request.ImageUrl
        };

        bool success = await _service.UpdateAsync(id, ev);
        if (!success) return NotFound();

        return NoContent();
    }

    // DELETE /Event/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
