using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UserFavouriteController : ControllerBase
{
    private readonly IUserFavouriteService _service;

    public UserFavouriteController(IUserFavouriteService service)
    {
        _service = service;
    }
    
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