using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;

    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }
    
    // GET /User
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetAll()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    // GET /User/{id}
    [HttpGet("{id:int}")]
    public ActionResult<User> GetById(int id)
    {
        var user = _userService.GetUserById(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    // POST /User
    [HttpPost]
    public ActionResult<User> Create([FromBody] User user)
    {
        // basic validation could be added here
        _userService.AddUser(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // PUT /User/{id}
    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] User user)
    {
        var existing = _userService.GetUserById(id);
        if (existing == null) return NotFound();

        // Ensure the incoming user has the correct Id
        user.Id = id;
        _userService.UpdateUser(user);
        return NoContent();
    }

    // DELETE /User/{id}
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var existing = _userService.GetUserById(id);
        if (existing == null) return NotFound();

        _userService.DeleteUser(id);
        return NoContent();
    }
}