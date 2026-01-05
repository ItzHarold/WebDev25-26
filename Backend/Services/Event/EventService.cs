using Backend.Data;
using Backend.Models;
using Backend.Services.Image;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for managing events.
/// </summary>
public interface IEventService
{
    /// <summary>
    /// Retrieves all events from the database.
    /// </summary>
    Task<List<Event>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific event by its ID.
    /// </summary>
    Task<Event?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new event and logs the action.
    /// </summary>
    Task<Event> CreateAsync(Event ev, int userId, string userRole);

    /// <summary>
    /// Updates an existing event and logs the action.
    /// </summary>
    Task<bool> UpdateAsync(int id, Event ev, int userId, string userRole);

    /// <summary>
    /// Deletes an event and logs the action.
    /// </summary>
    Task<bool> DeleteAsync(int id, int userId, string userRole);

    /// <summary>
    /// Uploads an image for an event.
    /// </summary>
    Task<string?> UploadEventPictureAsync(int userId, IFormFile file);
}

/// <summary>
/// Service responsible for managing esports events.
/// Handles CRUD operations with audit logging for all modifications.
/// </summary>
public class EventService : IEventService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;
    private readonly IImageService _imageService;

    /// <summary>
    /// Initializes a new instance of the EventService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    /// <param name="loggerService">Service for audit logging</param>
    /// <param name="imageService">Service for image upload handling</param>
    public EventService(AppDbContext context, ILoggerService loggerService, IImageService imageService)
    {
        _context = context;
        _loggerService = loggerService;
        _imageService = imageService;
    }

    /// <summary>
    /// Retrieves all events from the database.
    /// </summary>
    /// <returns>A list of all events</returns>
    public Task<List<Event>> GetAllAsync()
    {
        return _context.Events.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific event by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the event</param>
    /// <returns>The event if found, null otherwise</returns>
    public Task<Event?> GetByIdAsync(int id)
    {
        return _context.Events.FindAsync(id).AsTask();
    }

    /// <summary>
    /// Creates a new event in the database.
    /// </summary>
    /// <param name="ev">The event data to create</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>The created event with generated ID</returns>
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

    /// <summary>
    /// Updates an existing event in the database.
    /// </summary>
    /// <param name="id">The ID of the event to update</param>
    /// <param name="data">The new event data</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if update succeeded, false if event not found</returns>
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

    /// <summary>
    /// Deletes an event from the database.
    /// </summary>
    /// <param name="id">The ID of the event to delete</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if deletion succeeded, false if event not found</returns>
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

    /// <summary>
    /// Uploads and saves a new image for an event.
    /// Replaces the old image if one exists.
    /// </summary>
    /// <param name="evId">The ID of the event to update</param>
    /// <param name="file">The image file to upload</param>
    /// <returns>The URL of the uploaded image, or null if event not found</returns>
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
