using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for the audit logging system.
/// </summary>
public interface ILoggerService
{
    /// <summary>
    /// Retrieves all log entries ordered by creation date (newest first).
    /// </summary>
    Task<List<Logger>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific log entry by its ID.
    /// </summary>
    Task<Logger?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new log entry.
    /// </summary>
    Task<Logger> CreateAsync(Logger log);

    /// <summary>
    /// Retrieves all log entries for a specific user.
    /// </summary>
    Task<List<Logger>> GetByUserIdAsync(int userId);

    /// <summary>
    /// Retrieves all log entries for a specific entity type.
    /// </summary>
    Task<List<Logger>> GetByEntityTypeAsync(string entityType);
}

/// <summary>
/// Service responsible for audit logging of user actions.
/// Tracks CREATE, UPDATE, and DELETE operations on entities for accountability.
/// </summary>
public class LoggerService : ILoggerService
{
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes a new instance of the LoggerService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    public LoggerService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all log entries from the database.
    /// Results are ordered by creation date with newest entries first.
    /// </summary>
    /// <returns>A list of all log entries sorted by date descending</returns>
    public Task<List<Logger>> GetAllAsync()
    {
        return _context.Loggers.OrderByDescending(logEntry => logEntry.CreatedAt).ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific log entry by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the log entry</param>
    /// <returns>The log entry if found, null otherwise</returns>
    public Task<Logger?> GetByIdAsync(int id)
    {
        return _context.Loggers.FindAsync(id).AsTask();
    }

    /// <summary>
    /// Creates a new log entry in the database.
    /// Used by other services to record user actions.
    /// </summary>
    /// <param name="logEntry">The log entry data to create</param>
    /// <returns>The created log entry with generated ID</returns>
    public async Task<Logger> CreateAsync(Logger logEntry)
    {
        _context.Loggers.Add(logEntry);
        await _context.SaveChangesAsync();
        return logEntry;
    }

    /// <summary>
    /// Retrieves all log entries created by a specific user.
    /// Useful for auditing individual user activity.
    /// </summary>
    /// <param name="userId">The ID of the user to filter by</param>
    /// <returns>A list of log entries for the user, sorted by date descending</returns>
    public Task<List<Logger>> GetByUserIdAsync(int userId)
    {
        return _context.Loggers
            .Where(logEntry => logEntry.UserId == userId)
            .OrderByDescending(logEntry => logEntry.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves all log entries for a specific entity type.
    /// Useful for auditing changes to specific types like "User", "Team", or "Event".
    /// </summary>
    /// <param name="entityType">The entity type to filter by (e.g., "User", "Team", "Event")</param>
    /// <returns>A list of log entries for the entity type, sorted by date descending</returns>
    public Task<List<Logger>> GetByEntityTypeAsync(string entityType)
    {
        return _context.Loggers
            .Where(logEntry => logEntry.EntityType == entityType)
            .OrderByDescending(logEntry => logEntry.CreatedAt)
            .ToListAsync();
    }
}
