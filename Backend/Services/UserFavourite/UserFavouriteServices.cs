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
    public async Task<UserFavourite> CreateAsync(int userId, int evenId)
    {

        var user = await _context.Users.FindAsync(userId);
        var even = await _context.Events.FindAsync(evenId);

        //chekk if user or event dont exist
        if (user == null || even == null)
        throw new ArgumentException("User or Event not found");

        //Check if favourite already exists
        var favourites = await _context.UserFavourites.ToListAsync();
        foreach (var favItem in favourites)
        {
            if (favItem.UserId == user.Id && favItem.EventId == even.Id)
            {
                throw new ArgumentException("Event Already in Favourites");
            }
        }

        var fav = new UserFavourite
        {
            UserId = user.Id,
            EventId = even.Id
        };
        
        _context.UserFavourites.Add(fav);
        await _context.SaveChangesAsync();

        return fav;
    }
    public async Task<bool> UpdateAsync(int id, UserFavourite UserFavourite)
    {
        var existing = await _context.UserFavourites.FindAsync(id);
        if (existing == null)
        {
            return false;
        }
        existing.UserId = UserFavourite.UserId;
        existing.EventId = UserFavourite.EventId;
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


