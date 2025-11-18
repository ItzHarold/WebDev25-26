using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IUserService
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<bool> UpdateAsync(int id, User user);
    Task<bool> DeleteAsync(int id);
    Task<User?> LoginAsync(string username, string password);
}

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    // get all users from the database
    public Task<List<User>> GetAllAsync()
    {
        return _context.Users.ToListAsync();
    }

    // find a single user by id
    public Task<User?> GetByIdAsync(int id)
    {
        return _context.Users.FindAsync(id).AsTask();
    }

    // add a new user and save
    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    // update an existing user if it exists
    public async Task<bool> UpdateAsync(int id, User data)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.Role = data.Role;
        user.FirstName = data.FirstName;
        user.LastName = data.LastName;
        user.UserName = data.UserName;
        user.Email = data.Email;
        user.Password = data.Password;
        user.Dob = data.Dob;
        user.TeamId = data.TeamId;
        user.ImageUrl = data.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    // delete a user by id
    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
    
    // authenticate user by username and password
    public async Task<User?> LoginAsync(string username, string password)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == username && u.Password == password);
    }

}