using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IUserService
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user, int userId, string userRole);
    Task<bool> CreateUser(RegisterRequest request);
    Task<bool> UpdateAsync(int id, User user, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);

    IQueryable<User> Users();
}

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IPasswordService _password;
    private readonly ILoggerService _loggerService;

    public IQueryable<User> Users() => _context.Users.AsQueryable();

    public UserService(AppDbContext context, IPasswordService password, ILoggerService loggerService)
    {
        _context = context;
        _password = password;
        _loggerService = loggerService;
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
    
    public async Task<User> CreateAsync(User user, int userId, string userRole)
    {
        var usernameTaken = await _context.Users.AnyAsync(u => u.UserName == user.UserName);
        var emailTaken = await _context.Users.AnyAsync(u => u.Email == user.Email);
        
        if (usernameTaken)
            throw new InvalidOperationException($"Username '{user.UserName}' already exists");
        if (emailTaken)
            throw new InvalidOperationException($"Email '{user.Email}' already exists");
        if (user.TeamId != null)
        {
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == user.TeamId);
            if (!teamExists)
                throw new KeyNotFoundException($"Team with id {user.TeamId} not found");
        }

        user.Password = _password.Hash(user.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "CREATE",
            EntityType = "User",
            EntityId = user.Id,
            EntityName = user.UserName,
            Details = $"{userRole} (ID:{userId}) created user '{user.UserName}' ({user.Role})"
        });

        return user;
    }

    // create a new user from a register request
    public async Task<bool> CreateUser(RegisterRequest request)
    {
        var user = new User
        {
            Role = request.Role.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            UserName = request.UserName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Password = _password.Hash(request.Password),
            Dob = request.Dob,
            TeamId = request.TeamId,
            ImageUrl = request.ImageUrl
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return true;
    }


    // update an existing user if it exists
    public async Task<bool> UpdateAsync(int id, User data, int userId, string userRole)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        var emailTaken = await _context.Users
            .AnyAsync(u => u.Id != id && u.Email == data.Email);
        var usernameTaken = await _context.Users
            .AnyAsync(u => u.Id != id && u.UserName == data.UserName);
        
        if (usernameTaken)
            throw new InvalidOperationException($"Username '{data.UserName}' already exists");
        if (emailTaken)
            throw new InvalidOperationException($"Email '{data.Email}' already exists");
        if (data.TeamId != null)
        {
            var teamExists = await _context.Teams.AnyAsync(t => t.Id == data.TeamId);
            if (!teamExists)
                throw new KeyNotFoundException($"Team with id {data.TeamId} not found");
        }

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

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "UPDATE",
            EntityType = "User",
            EntityId = id,
            EntityName = user.UserName,
            Details = $"{userRole} (ID:{userId}) updated user '{user.UserName}'"
        });

        return true;
    }

    // delete a user by id
    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        var userName = user.UserName;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "DELETE",
            EntityType = "User",
            EntityId = id,
            EntityName = userName,
            Details = $"{userRole} (ID:{userId}) deleted user '{userName}'"
        });

        return true;
    }
}