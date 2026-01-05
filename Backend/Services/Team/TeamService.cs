using Backend.Data;
using Backend.Models;
using Backend.Services.Image;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for managing teams.
/// </summary>
public interface ITeamService
{
    /// <summary>
    /// Retrieves all teams from the database.
    /// </summary>
    Task<List<Team>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific team by its ID.
    /// </summary>
    Task<Team?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new team and logs the action.
    /// </summary>
    Task<Team> CreateAsync(Team team, int userId, string userRole);

    /// <summary>
    /// Updates an existing team and logs the action.
    /// </summary>
    Task<bool> UpdateAsync(int id, Team team, int userId, string userRole);

    /// <summary>
    /// Deletes a team and logs the action.
    /// </summary>
    Task<bool> DeleteAsync(int id, int userId, string userRole);

    /// <summary>
    /// Uploads an image for a team.
    /// </summary>
    Task<string?> UploadTeamPictureAsync(int userId, IFormFile file);
}

/// <summary>
/// Service responsible for managing esports teams.
/// Handles CRUD operations with audit logging and manager validation.
/// </summary>
public class TeamService : ITeamService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;
    private readonly IImageService _imageService;

    /// <summary>
    /// Initializes a new instance of the TeamService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    /// <param name="loggerService">Service for audit logging</param>
    /// <param name="imageService">Service for image upload handling</param>
    public TeamService(AppDbContext context, ILoggerService loggerService, IImageService imageService)
    {
        _context = context;
        _loggerService = loggerService;
        _imageService = imageService;
    }

    /// <summary>
    /// Retrieves all teams from the database.
    /// </summary>
    /// <returns>A list of all teams</returns>
    public Task<List<Team>> GetAllAsync()
    {
        return _context.Teams.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific team by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the team</param>
    /// <returns>The team if found, null otherwise</returns>
    public Task<Team?> GetByIdAsync(int id)
    {
        return _context.Teams.FindAsync(id).AsTask();
    }

    /// <summary>
    /// Creates a new team in the database.
    /// Validates that the specified manager has the "manager" role.
    /// </summary>
    /// <param name="team">The team data to create</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>The created team with generated ID</returns>
    /// <exception cref="InvalidOperationException">Thrown when the specified manager is not a manager</exception>
    public async Task<Team> CreateAsync(Team team, int userId, string userRole)
    {
        var isManager = await _context.Users.AnyAsync(u => u.Id == team.ManagerId && u.Role == "manager");
        if (!isManager)
            throw new InvalidOperationException($"User {team.ManagerId} is not a manager");

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "CREATE",
                EntityType = "Team",
                EntityName = team.Description ?? "Unnamed Team",
                Details = $"{userRole} (ID:{userId}) created team '{team.Description}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log team creation: {ex.Message}");
        }

        return team;
    }

    /// <summary>
    /// Updates an existing team in the database.
    /// Validates that the specified manager has the "manager" role.
    /// </summary>
    /// <param name="id">The ID of the team to update</param>
    /// <param name="data">The new team data</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if update succeeded, false if team not found</returns>
    /// <exception cref="InvalidOperationException">Thrown when the specified manager is not a manager</exception>
    public async Task<bool> UpdateAsync(int id, Team data, int userId, string userRole)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return false;

        var isManager = await _context.Users.AnyAsync(u => u.Id == data.ManagerId && u.Role == "manager");
        if (!isManager)
            throw new InvalidOperationException($"User {data.ManagerId} is not a manager");

        team.Description = data.Description;
        team.Points = data.Points;
        team.ImageUrl = data.ImageUrl;
        team.ManagerId = data.ManagerId;

        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "UPDATE",
                EntityType = "Team",
                EntityName = team.Description ?? "Unnamed Team",
                Details = $"{userRole} (ID:{userId}) updated team '{team.Description}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log team update: {ex.Message}");
        }

        return true;
    }

    /// <summary>
    /// Deletes a team from the database.
    /// </summary>
    /// <param name="id">The ID of the team to delete</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if deletion succeeded, false if team not found</returns>
    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return false;

        var teamDescription = team.Description ?? "Unnamed Team";

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        try
        {
            await _loggerService.CreateAsync(new Logger
            {
                UserId = userId,
                UserRole = userRole,
                Action = "DELETE",
                EntityType = "Team",
                EntityName = teamDescription,
                Details = $"{userRole} (ID:{userId}) deleted team '{teamDescription}'"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Warning: Failed to log team deletion: {ex.Message}");
        }

        return true;
    }

    /// <summary>
    /// Uploads and saves a new image for a team.
    /// Replaces the old image if one exists.
    /// </summary>
    /// <param name="TeamId">The ID of the team to update</param>
    /// <param name="file">The image file to upload</param>
    /// <returns>The URL of the uploaded image, or null if team not found</returns>
    public async Task<string?> UploadTeamPictureAsync(int TeamId, IFormFile file)
    {
        var team = await _context.Teams.FindAsync(TeamId);
        if (team == null)
            return null;
            
        var newImageUrl = await _imageService.SaveImageAsync(file, "team-pictures", team.ImageUrl);
        team.ImageUrl = newImageUrl;
        await _context.SaveChangesAsync();
        return team.ImageUrl;
    }
}