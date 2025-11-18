using System.Security.Cryptography.X509Certificates;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IUserFavouriteService
{
    Task<List<UserFavourite>> GetAllAsync();
    Task<UserFavourite?> GetByIdAsync(int id);
    Task<UserFavourite> CreateAsync(User user, Event ev);
    Task<bool> UpdateAsync(int id, UserFavourite UserFavourite);
    Task<bool> DeleteAsync(int id);

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
        public Task<UserFavourite> CreateAsync(User user, Event ev)
        {
            return null;
        }
        public Task<bool> UpdateAsync(int id, UserFavourite UserFavourite)
        {
            return default;
        }
        public Task<bool> DeleteAsync(int id)
        {
            return default;
        }
    }

}


