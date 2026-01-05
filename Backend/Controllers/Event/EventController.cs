using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing esports events.
/// Provides endpoints for CRUD operations on events.
/// </summary>
[Authorize]
[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _service;

    /// <summary>
    /// Initializes a new instance of the EventController.
    /// </summary>
    /// <param name="service">The event service for data operations</param>
    public EventController(IEventService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all events.
    /// </summary>
    /// <returns>A list of all events</returns>
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

    /// <summary>
    /// Retrieves a specific event by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the event</param>
    /// <returns>The event if found, NotFound otherwise</returns>
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

    /// <summary>
    /// Creates a new event. Admin only.
    /// </summary>
    /// <param name="request">The event data to create</param>
    /// <returns>The created event with its assigned ID</returns>
    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<EventResponse>> Create([FromBody] EventRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

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

        Event created = await _service.CreateAsync(ev, userId, userRole);

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

    /// <summary>
    /// Updates an existing event. Admin only.
    /// </summary>
    /// <param name="id">The ID of the event to update</param>
    /// <param name="request">The updated event data</param>
    /// <returns>NoContent if successful, NotFound if event doesn't exist</returns>
    [Authorize(Roles = "admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] EventRequest request)
    {
        // Get user info from JWT token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
        if (userIdClaim == null) return Unauthorized();
        int userId = int.Parse(userIdClaim);

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

        bool success = await _service.UpdateAsync(id, ev, userId, userRole);
        if (!success) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Deletes an event. Admin only.
    /// </summary>
    /// <param name="id">The ID of the event to delete</param>
    /// <returns>NoContent if successful, NotFound if event doesn't exist</returns>
    [Authorize(Roles = "admin")]
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

    /// <summary>
    /// Uploads an image for a specific event.
    /// </summary>
    /// <param name="request">The upload request containing event ID and image file</param>
    /// <returns>The URL of the uploaded image, or NotFound if event doesn't exist</returns>
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadEventImage([FromForm] EventImageUploadRequest request)
    {
        if (request.ImageUrl == null || request.ImageUrl.Length == 0)
            return BadRequest("No file uploaded.");

        var result = await _service.UploadEventPictureAsync(id, request.ImageUrl);
        if (result == null)
            return NotFound("Event not found.");

        return Ok(new { imageUrl = result });
    }
}
