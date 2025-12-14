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
        return _context.Loggers.OrderByDescending(l => l.CreatedAt).ToListAsync();
    }

    // find a single log by id
    public Task<Logger?> GetByIdAsync(int id)
    {
        return _context.Loggers.FindAsync(id).AsTask();
    }

    // add a new log and save
    public async Task<Logger> CreateAsync(Logger log)
    {
        _context.Loggers.Add(log);
        await _context.SaveChangesAsync();
        return log;
    }

    // get all logs by a specific user
    public Task<List<Logger>> GetByUserIdAsync(int userId)
    {
        return _context.Loggers
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }

    // get all logs for a specific entity type (User, Team, Event, etc.)
    public Task<List<Logger>> GetByEntityTypeAsync(string entityType)
    {
        return _context.Loggers
            .Where(l => l.EntityType == entityType)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }
}
