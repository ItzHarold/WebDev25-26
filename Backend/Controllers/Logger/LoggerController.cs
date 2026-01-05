using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

/// <summary>
/// Controller for managing audit logs.
/// Provides endpoints for retrieving system logs. Admin only access.
/// </summary>
[Authorize(Roles = "admin")]
[ApiController]
[Route("[controller]")]
public class LoggerController : ControllerBase
{
    private readonly ILoggerService _service;

    /// <summary>
    /// Initializes a new instance of the LoggerController.
    /// </summary>
    /// <param name="service">The logger service for audit log operations</param>
    public LoggerController(ILoggerService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves all audit log entries.
    /// </summary>
    /// <returns>A list of all log entries</returns>
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
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }

    /// <summary>
    /// Retrieves a specific log entry by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the log entry</param>
    /// <returns>The log entry if found, NotFound otherwise</returns>
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
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        };
        return Ok(response);
    }

    /// <summary>
    /// Retrieves all log entries for a specific user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user</param>
    /// <returns>A list of log entries associated with the specified user</returns>
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
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }

    /// <summary>
    /// Retrieves all log entries for a specific entity type.
    /// </summary>
    /// <param name="entityType">The entity type to filter by (e.g., "Event", "User", "Team")</param>
    /// <returns>A list of log entries associated with the specified entity type</returns>
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
            EntityName = logEntry.EntityName,
            Details = logEntry.Details,
            CreatedAt = logEntry.CreatedAt
        });
        return Ok(response);
    }
}
