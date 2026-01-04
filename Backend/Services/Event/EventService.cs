using Backend.Data;
using Backend.Models;
using Backend.Services.Image;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IEventService
{
    Task<List<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(int id);
    Task<Event> CreateAsync(Event ev, int userId, string userRole);
    Task<bool> UpdateAsync(int id, Event ev, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);
    Task<string?> UploadEventPictureAsync(int userId, IFormFile file);
}

public class EventService : IEventService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;
    private readonly IImageService _imageService;

    public EventService(AppDbContext context, ILoggerService loggerService, IImageService imageService)
    {
        _context = context;
        _loggerService = loggerService;
        _imageService = imageService;
    }

    public Task<List<Event>> GetAllAsync()
    {
        return _context.Events.ToListAsync();
    }

    public Task<Event?> GetByIdAsync(int id)
    {
        return _context.Events.FindAsync(id).AsTask();
    }

    public async Task<Event> CreateAsync(Event ev, int userId, string userRole)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "CREATE",
                EntityType = "Event",
                EntityName = ev.Title,
                Details = $"{userRole} (ID:{userId}) created event '{ev.Title}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log event creation: {ex.Message}");
        }

        return ev;
    }

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

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "UPDATE",
                EntityType = "Event",
                EntityName = ev.Title,
                Details = $"{userRole} (ID:{userId}) updated event '{ev.Title}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log event update: {ex.Message}");
        }

        return true;
    }

    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        var eventTitle = ev.Title;

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "DELETE",
                EntityType = "Event",
                EntityName = eventTitle,
                Details = $"{userRole} (ID:{userId}) deleted event '{eventTitle}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log event deletion: {ex.Message}");
        }

        return true;
    }

    public async Task<string?> UploadEventPictureAsync(int evId, IFormFile file)
    {
        var ev = await _context.Events.FindAsync(evId);
        if (ev == null)
            return null;
            
        var newImageUrl = await _imageService.SaveImageAsync(file, "event-pictures", ev.ImageUrl);
        ev.ImageUrl = newImageUrl;
        await _context.SaveChangesAsync();
        return ev.ImageUrl;
    }
}