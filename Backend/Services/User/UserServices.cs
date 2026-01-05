using Backend.Data;
using Backend.Models;
using Backend.Services.Image;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for managing users.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Retrieves all users from the database.
    /// </summary>
    Task<List<User>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific user by their ID.
    /// </summary>
    Task<User?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new user with admin logging.
    /// </summary>
    Task<User> CreateAsync(User user, int userId, string userRole);

    /// <summary>
    /// Creates a new user from a registration request.
    /// </summary>
    Task<bool> CreateUser(RegisterRequest request);

    /// <summary>
    /// Updates an existing user and logs the action.
    /// </summary>
    Task<bool> UpdateAsync(int id, User user, int userId, string userRole);

    /// <summary>
    /// Deletes a user and logs the action.
    /// </summary>
    Task<bool> DeleteAsync(int id, int userId, string userRole);

    /// <summary>
    /// Changes a user's password after verifying the current password.
    /// </summary>
    Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);

    /// <summary>
    /// Uploads a profile picture for a user.
    /// </summary>
    Task<string?> UploadProfilePictureAsync(int userId, IFormFile file);

    /// <summary>
    /// Returns a queryable collection of users for custom queries.
    /// </summary>
    IQueryable<User> Users();
}

/// <summary>
/// Service responsible for managing users in the system.
/// Handles CRUD operations, password management, and profile pictures with audit logging.
/// </summary>
public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IPasswordService _password;
    private readonly ILoggerService _loggerService;
    private readonly IImageService _imageService;

    /// <summary>
    /// Returns a queryable collection of users for custom queries.
    /// </summary>
    /// <returns>IQueryable of User entities</returns>
    public IQueryable<User> Users() => _context.Users.AsQueryable();

    /// <summary>
    /// Initializes a new instance of the UserService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    /// <param name="password">Service for password hashing and verification</param>
    /// <param name="loggerService">Service for audit logging</param>
    /// <param name="imageService">Service for image upload handling</param>
    public UserService(AppDbContext context, IPasswordService password, ILoggerService loggerService, IImageService imageService)
    {
        _context = context;
        _password = password;
        _loggerService = loggerService;
        _imageService = imageService;
    }

    /// <summary>
    /// Retrieves all users from the database.
    /// </summary>
    /// <returns>A list of all users</returns>
    public Task<List<User>> GetAllAsync()
    {
        return _context.Users.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific user by their ID.
    /// </summary>
    /// <param name="id">The unique identifier of the user</param>
    /// <returns>The user if found, null otherwise</returns>
    public Task<User?> GetByIdAsync(int id)
    {
        return _context.Users.FindAsync(id).AsTask();
    }

    /// <summary>
    /// Creates a new user in the database (admin operation).
    /// Validates username and email uniqueness, and team existence.
    /// </summary>
    /// <param name="user">The user data to create</param>
    /// <param name="userId">ID of the admin performing the action (for audit)</param>
    /// <param name="userRole">Role of the admin performing the action (for audit)</param>
    /// <returns>The created user with generated ID</returns>
    /// <exception cref="InvalidOperationException">Thrown when username or email already exists</exception>
    /// <exception cref="KeyNotFoundException">Thrown when specified team does not exist</exception>
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

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "CREATE",
                EntityType = "User",
                EntityName = user.UserName,
                Details = $"{userRole} (ID:{userId}) created user '{user.UserName}' ({user.Role})"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log user creation: {ex.Message}");
        }

        return user;
    }

    /// <summary>
    /// Creates a new user from a registration request (self-registration).
    /// Hashes the password and normalizes email to lowercase.
    /// </summary>
    /// <param name="request">The registration data</param>
    /// <returns>True if user was created successfully</returns>
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

    /// <summary>
    /// Updates an existing user in the database.
    /// Requires current password verification for security.
    /// Validates username and email uniqueness.
    /// </summary>
    /// <param name="id">The ID of the user to update</param>
    /// <param name="data">The new user data (must include current password)</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if update succeeded, false if user not found</returns>
    /// <exception cref="InvalidOperationException">Thrown when password is invalid or username/email already exists</exception>
    /// <exception cref="KeyNotFoundException">Thrown when specified team does not exist</exception>
    public async Task<bool> UpdateAsync(int id, User data, int userId, string userRole)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        if (!_password.Verify(user.Password, data.Password))
            throw new InvalidOperationException("Invalid password");

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
        user.Dob = data.Dob;
        user.TeamId = data.TeamId;
        user.ImageUrl = data.ImageUrl;

        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "UPDATE",
                EntityType = "User",
                EntityName = user.UserName,
                Details = $"{userRole} (ID:{userId}) updated user '{user.UserName}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log user update: {ex.Message}");
        }

        return true;
    }

    /// <summary>
    /// Deletes a user from the database.
    /// </summary>
    /// <param name="id">The ID of the user to delete</param>
    /// <param name="userId">ID of the admin performing the action (for audit)</param>
    /// <param name="userRole">Role of the admin performing the action (for audit)</param>
    /// <returns>True if deletion succeeded, false if user not found</returns>
    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        var userName = user.UserName;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "DELETE",
                EntityType = "User",
                EntityName = userName,
                Details = $"{userRole} (ID:{userId}) deleted user '{userName}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log user deletion: {ex.Message}");
        }

        return true;
    }

    /// <summary>
    /// Uploads and saves a new profile picture for a user.
    /// Replaces the old image if one exists.
    /// </summary>
    /// <param name="userId">The ID of the user to update</param>
    /// <param name="file">The image file to upload</param>
    /// <returns>The URL of the uploaded image, or null if user not found</returns>
    public async Task<string?> UploadProfilePictureAsync(int userId, IFormFile file)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return null;
            
        var newImageUrl = await _imageService.SaveImageAsync(file, "profile-pictures", user.ImageUrl);
        user.ImageUrl = newImageUrl;
        await _context.SaveChangesAsync();
        return user.ImageUrl;
    }

    /// <summary>
    /// Changes a user's password after verifying the current password.
    /// The new password is hashed before storage.
    /// </summary>
    /// <param name="userId">The ID of the user changing their password</param>
    /// <param name="currentPassword">The user's current password for verification</param>
    /// <param name="newPassword">The new password to set</param>
    /// <returns>True if password was changed, false if user not found or current password is incorrect</returns>
    public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        if (!_password.Verify(user.Password, currentPassword))
            return false;

        user.Password = _password.Hash(newPassword);
        await _context.SaveChangesAsync();

        return true;
    }
}
