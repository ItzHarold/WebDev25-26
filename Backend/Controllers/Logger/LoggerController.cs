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
        var logEntries = await _service.GetAllAsync();
        var response = logEntries.Select(logEntry => new LoggerResponse
        {
            Id = logEntry.Id,
            UserId = logEntry.UserId,
            UserRole = logEntry.UserRole,
            Action = logEntry.Action,
            EntityType = logEntry.EntityType,
            EntityId = logEntry.EntityId,
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }

    // GET /Logger/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<LoggerResponse>> GetById(int id)
    {
        var logEntry = await _service.GetByIdAsync(id);
        if (logEntry == null) return NotFound();
        
        var response = new LoggerResponse
        {
            Id = logEntry.Id,
            UserId = logEntry.UserId,
            UserRole = logEntry.UserRole,
            Action = logEntry.Action,
            EntityType = logEntry.EntityType,
            EntityId = logEntry.EntityId,
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        };
        return Ok(response);
    }

    // GET /Logger/user/{userId}
    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<LoggerResponse>>> GetByUserId(int userId)
    {
        var logEntries = await _service.GetByUserIdAsync(userId);
        var response = logEntries.Select(logEntry => new LoggerResponse
        {
            Id = logEntry.Id,
            UserId = logEntry.UserId,
            UserRole = logEntry.UserRole,
            Action = logEntry.Action,
            EntityType = logEntry.EntityType,
            EntityId = logEntry.EntityId,
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }

    // GET /Logger/entity/{entityType}
    [HttpGet("entity/{entityType}")]
    public async Task<ActionResult<IEnumerable<LoggerResponse>>> GetByEntityType(string entityType)
    {
        var logEntries = await _service.GetByEntityTypeAsync(entityType);
        var response = logEntries.Select(logEntry => new LoggerResponse
        {
            Id = logEntry.Id,
            UserId = logEntry.UserId,
            UserRole = logEntry.UserRole,
            Action = logEntry.Action,
            EntityType = logEntry.EntityType,
            EntityId = logEntry.EntityId,
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }
}
