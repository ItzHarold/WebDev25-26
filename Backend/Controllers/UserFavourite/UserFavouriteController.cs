using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing user favorite events.
/// Provides endpoints for CRUD operations on user favorites.
/// </summary>
[Authorize]
[ApiController]
[Route("[controller]")]
public class UserFavouriteController : ControllerBase
{
    private readonly IUserFavouriteService _service;

    /// <summary>
    /// Initializes a new instance of the UserFavouriteController.
    /// </summary>
    /// <param name="service">The user favourite service for data operations</param>
    public UserFavouriteController(IUserFavouriteService service)
    {
        _service = service;
    }
    
    /// <summary>
    /// Retrieves all user favorites.
    /// </summary>
    /// <returns>A list of all user favorite associations</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserFavouriteResponse>>> GetAll()
    {
        var favourites = await _service.GetAllAsync();
        var response = favourites.Select(f => new UserFavouriteResponse
        {
            Id = f.Id,
            UserId = f.UserId,
            EventId = f.EventId
        });
        return Ok(response);
    }
    
    /// <summary>
    /// Retrieves a specific user favorite by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the user favorite</param>
    /// <returns>The user favorite if found, NotFound otherwise</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserFavouriteResponse>> GetById(int id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        
        var response = new UserFavouriteResponse
        {
            Id = item.Id,
            UserId = item.UserId,
            EventId = item.EventId
        };
        return Ok(response);
    }

    /// <summary>
    /// Creates a new user favorite for an event.
    /// </summary>
    /// <param name="request">The favorite data containing user ID and event ID</param>
    /// <returns>The created user favorite, or BadRequest if creation fails</returns>
    [HttpPost]
    public async Task<ActionResult<UserFavouriteResponse>> Create([FromBody] UserFavouriteRequest request)
    {
        try
        {
            var created = await _service.CreateAsync(request.UserId, request.EventId);
            var response = new UserFavouriteResponse
            {
                Id = created.Id,
                UserId = created.UserId,
                EventId = created.EventId
            };
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    /// <summary>
    /// Deletes a user favorite.
    /// </summary>
    /// <param name="id">The ID of the user favorite to delete</param>
    /// <returns>NoContent if successful, NotFound if favorite doesn't exist</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}