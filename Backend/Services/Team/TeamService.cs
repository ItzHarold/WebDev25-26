using Backend.Data;
using Backend.Models;
using Backend.Services.Image;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface ITeamService
{
    Task<List<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(int id);
    Task<Team> CreateAsync(Team team, int userId, string userRole);
    Task<bool> UpdateAsync(int id, Team team, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);
    Task<string?> UploadTeamPictureAsync(int userId, IFormFile file);
}

public class TeamService : ITeamService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;
    private readonly IImageService _imageService;

    public TeamService(AppDbContext context, ILoggerService loggerService, IImageService imageService)
    {
        _context = context;
        _loggerService = loggerService;
        _imageService = imageService;
    }

    public Task<List<Team>> GetAllAsync()
    {
        return _context.Teams.ToListAsync();
    }

    public Task<Team?> GetByIdAsync(int id)
    {
        return _context.Teams.FindAsync(id).AsTask();
    }

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