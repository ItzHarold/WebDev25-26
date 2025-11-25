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
        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _service.GetAllAsync();
            return Ok(list);
        }
    }
}