using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IEventService
{
    Task<List<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(int id);
    Task<Event> CreateAsync(Event ev, int userId, string userRole);
    Task<bool> UpdateAsync(int id, Event ev, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);
}

public class EventService : IEventService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;

    public EventService(AppDbContext context, ILoggerService loggerService)
    {
        _context = context;
        _loggerService = loggerService;
    }

    // get all events
    public Task<List<Event>> GetAllAsync()
    {
        return _context.Events.ToListAsync();
    }

    // find event by id
    public Task<Event?> GetByIdAsync(int id)
    {
        return _context.Events.FindAsync(id).AsTask();
    }

    // create new event
    public async Task<Event> CreateAsync(Event ev, int userId, string userRole)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "CREATE",
            EntityType = "Event",
            EntityId = ev.Id,
            EntityName = ev.Title,
            Details = $"{userRole} (ID:{userId}) created event '{ev.Title}'"
        });

        return ev;
    }

    // update event if it exists
    public async Task<bool> UpdateAsync(int id, Event data, int userId, string userRole)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        ev.Title = data.Title;
        ev.Location = data.Location;
        ev.Date = data.Date;
        ev.Description = data.Description;
        ev.Detail = data.Detail;
        ev.Status = data.Status;
        ev.ImageUrl = data.ImageUrl;

        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "UPDATE",
            EntityType = "Event",
            EntityId = id,
            EntityName = ev.Title,
            Details = $"{userRole} (ID:{userId}) updated event '{ev.Title}'"
        });

        return true;
    }

    // delete event if found
    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        var eventTitle = ev.Title; // Store before deletion

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "DELETE",
            EntityType = "Event",
            EntityId = id,
            EntityName = eventTitle,
            Details = $"{userRole} (ID:{userId}) deleted event '{eventTitle}'"
        });

        return true;
    }
}