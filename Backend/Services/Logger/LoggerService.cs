using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface ILoggerService
{
    Task<List<Logger>> GetAllAsync();
    Task<Logger?> GetByIdAsync(int id);
    Task<Logger> CreateAsync(Logger log);
    Task<List<Logger>> GetByUserIdAsync(int userId);
    Task<List<Logger>> GetByEntityTypeAsync(string entityType);
}

public class LoggerService : ILoggerService
{
    private readonly AppDbContext _context;

    public LoggerService(AppDbContext context)
    {
        _context = context;
    }

    // get all logs from the database
    public Task<List<Logger>> GetAllAsync()
    {
        return _context.Loggers.OrderByDescending(logEntry => logEntry.CreatedAt).ToListAsync();
    }

    // find a single log by id
    public Task<Logger?> GetByIdAsync(int id)
    {
        return _context.Loggers.FindAsync(id).AsTask();
    }

    // add a new log and save
    public async Task<Logger> CreateAsync(Logger logEntry)
    {
        _context.Loggers.Add(logEntry);
        await _context.SaveChangesAsync();
        return logEntry;
    }

    // get all logs by a specific user
    public Task<List<Logger>> GetByUserIdAsync(int userId)
    {
        return _context.Loggers
            .Where(logEntry => logEntry.UserId == userId)
            .OrderByDescending(logEntry => logEntry.CreatedAt)
            .ToListAsync();
    }

    // get all logs for a specific entity type (User, Team, Event, etc.)
    public Task<List<Logger>> GetByEntityTypeAsync(string entityType)
    {
        return _context.Loggers
            .Where(logEntry => logEntry.EntityType == entityType)
            .OrderByDescending(logEntry => logEntry.CreatedAt)
            .ToListAsync();
    }
}
