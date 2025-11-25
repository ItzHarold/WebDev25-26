using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
[Route("[controller]")]
public class UserFavourite : ControllerBase
{
    private readonly IUserFavouriteService _service;
    private readonly ILogger<UserFavourite> _logger;

    public UserFavourite(IUserFavouriteService service, ILogger<UserFavourite> logger)
    {
        _service = service;
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View("Error!");
    }
}
}