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
        public async Task<UserFavourite> CreateAsync(User user, Event even)
        {

            if (user == null || even == null)
            {
                throw new ArgumentException("User or Event not found");
            }

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


