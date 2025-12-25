using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IUserFavouriteService
{
    Task<List<UserFavourite>> GetAllAsync();
    Task<UserFavourite?> GetByIdAsync(int id);
    Task<UserFavourite> CreateAsync(int userId, int eventId);
    Task<bool> UpdateAsync(int id, UserFavourite UserFavourite);
    Task<bool> DeleteAsync(int id);
}
public class UserFavouriteService : IUserFavouriteService
{
    private readonly AppDbContext _context;

    public UserFavouriteService(AppDbContext context)
    {
        _context = context;
    }
    public Task<List<UserFavourite>> GetAllAsync()
    {
        return _context.UserFavourites.ToListAsync();
    }
    public Task<UserFavourite?> GetByIdAsync(int id)
    {
        return _context.UserFavourites.FindAsync(id).AsTask();
    }
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


