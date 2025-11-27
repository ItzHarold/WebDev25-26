using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers;
public class CreateUserFavouriteDto
{
    public int UserId { get; set; }
    public int EventId { get; set; }
}

[ApiController]
[Route("[controller]")]

public class UserFavourite : ControllerBase
{
    private readonly IUserFavouriteService _service;

    public UserFavourite(IUserFavouriteService service)
    {
        _service = service;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());

    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserFavouriteDto dto)
    {
        try
        {
            var created = await _service.CreateAsync(dto.UserId, dto.EventId);
            return Ok(created);
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