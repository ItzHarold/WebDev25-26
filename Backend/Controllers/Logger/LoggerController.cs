using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("[controller]")]
public class LoggerController : ControllerBase
{
    private readonly ILoggerService _service;

    public LoggerController(ILoggerService service)
    {
        _service = service;
    }

    // GET /Logger
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoggerResponse>>> GetAll()
    {
        var logs = await _service.GetAllAsync();
        var response = logs.Select(l => new LoggerResponse
        {
            Id = l.Id,
            UserId = l.UserId,
            Action = l.Action,
            EntityType = l.EntityType,
            EntityId = l.EntityId,
            Details = l.Details,
            CreatedAt = l.CreatedAt
        });
        return Ok(response);
    }

    // GET /Logger/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<LoggerResponse>> GetById(int id)
    {
        var log = await _service.GetByIdAsync(id);
        if (log == null) return NotFound();
        
        var response = new LoggerResponse
        {
            Id = log.Id,
            UserId = log.UserId,
            Action = log.Action,
            EntityType = log.EntityType,
            EntityId = log.EntityId,
            Details = log.Details,
            CreatedAt = log.CreatedAt
        };
        return Ok(response);
    }

    // GET /Logger/user/{userId}
    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<LoggerResponse>>> GetByUserId(int userId)
    {
        var logs = await _service.GetByUserIdAsync(userId);
        var response = logs.Select(l => new LoggerResponse
        {
            Id = l.Id,
            UserId = l.UserId,
            Action = l.Action,
            EntityType = l.EntityType,
            EntityId = l.EntityId,
            Details = l.Details,
            CreatedAt = l.CreatedAt
        });
        return Ok(response);
    }

    // GET /Logger/entity/{entityType}
    [HttpGet("entity/{entityType}")]
    public async Task<ActionResult<IEnumerable<LoggerResponse>>> GetByEntityType(string entityType)
    {
        var logs = await _service.GetByEntityTypeAsync(entityType);
        var response = logs.Select(l => new LoggerResponse
        {
            Id = l.Id,
            UserId = l.UserId,
            Action = l.Action,
            EntityType = l.EntityType,
            EntityId = l.EntityId,
            Details = l.Details,
            CreatedAt = l.CreatedAt
        });
        return Ok(response);
    }
}
