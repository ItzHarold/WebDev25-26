using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for managing user favourite events.
/// </summary>
public interface IUserFavouriteService
{
    /// <summary>
    /// Retrieves all user-favourite relationships.
    /// </summary>
    Task<List<UserFavourite>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific favourite by its ID.
    /// </summary>
    Task<UserFavourite?> GetByIdAsync(int id);

    /// <summary>
    /// Adds an event to a user's favourites.
    /// </summary>
    Task<UserFavourite> CreateAsync(int userId, int eventId);

    /// <summary>
    /// Updates an existing favourite relationship.
    /// </summary>
    Task<bool> UpdateAsync(int id, UserFavourite UserFavourite);

    /// <summary>
    /// Removes an event from a user's favourites.
    /// </summary>
    Task<bool> DeleteAsync(int id);
}

/// <summary>
/// Service responsible for managing user favourite events.
/// Allows users to mark events as favourites for quick access.
/// </summary>
public class UserFavouriteService : IUserFavouriteService
{
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes a new instance of the UserFavouriteService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    public UserFavouriteService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all user-favourite relationships from the database.
    /// </summary>
    /// <returns>A list of all favourite relationships</returns>
    public Task<List<UserFavourite>> GetAllAsync()
    {
        return _context.UserFavourites.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific favourite relationship by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the favourite</param>
    /// <returns>The favourite if found, null otherwise</returns>
    public Task<UserFavourite?> GetByIdAsync(int id)
    {
        return _context.UserFavourites.FindAsync(id).AsTask();
    }

    /// <summary>
    /// Adds an event to a user's favourites list.
    /// Validates that both user and event exist, and that the event isn't already favourited.
    /// </summary>
    /// <param name="userId">The ID of the user</param>
    /// <param name="eventId">The ID of the event to favourite</param>
    /// <returns>The created favourite relationship</returns>
    /// <exception cref="KeyNotFoundException">Thrown when user or event does not exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when event is already in user's favourites</exception>
    public async Task<UserFavourite> CreateAsync(int userId, int eventId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        var eventExists = await _context.Events.AnyAsync(e => e.Id == eventId);
        var alreadyFavourite = await _context.UserFavourites
            .AnyAsync(f => f.UserId == userId && f.EventId == eventId);
        
        if (!userExists)
            throw new KeyNotFoundException($"User with id {userId} not found");
        if (!eventExists)
            throw new KeyNotFoundException($"Event with id {eventId} not found");
        if (alreadyFavourite)
            throw new InvalidOperationException("Event already in favourites");

        var fav = new UserFavourite
        {
            UserId = userId,
            EventId = eventId
        };

        _context.UserFavourites.Add(fav);
        await _context.SaveChangesAsync();

        return fav;
    }

    /// <summary>
    /// Updates an existing favourite relationship.
    /// Validates that the new user and event exist, and that the combination isn't already favourited.
    /// </summary>
    /// <param name="id">The ID of the favourite to update</param>
    /// <param name="data">The new favourite data</param>
    /// <returns>True if update succeeded, false if favourite not found</returns>
    /// <exception cref="KeyNotFoundException">Thrown when user or event does not exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when event is already in user's favourites</exception>
    public async Task<bool> UpdateAsync(int id, UserFavourite data)
    {
        var existing = await _context.UserFavourites.FindAsync(id);
        if (existing == null) return false;
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == data.UserId);
        var eventExists = await _context.Events.AnyAsync(e => e.Id == data.EventId);
        var alreadyFavourite = await _context.UserFavourites
            .AnyAsync(f => f.Id != id && f.UserId == data.UserId && f.EventId == data.EventId);

        if (!userExists)
            throw new KeyNotFoundException($"User with id {data.UserId} not found");
        if (!eventExists)
            throw new KeyNotFoundException($"Event with id {data.EventId} not found");
        if (alreadyFavourite)
            throw new InvalidOperationException("Event already in favourites");

        existing.UserId = data.UserId;
        existing.EventId = data.EventId;

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Removes an event from a user's favourites.
    /// </summary>
    /// <param name="id">The ID of the favourite to delete</param>
    /// <returns>True if deletion succeeded, false if favourite not found</returns>
    public async Task<bool> DeleteAsync(int id)
    {
        var fav = await _context.UserFavourites.FindAsync(id);
        if (fav == null)
        {
            return false;
        }
        _context.UserFavourites.Remove(fav);
        await _context.SaveChangesAsync();
        return true;
    }
}


