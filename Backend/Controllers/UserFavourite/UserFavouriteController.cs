using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Controllers;

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
}