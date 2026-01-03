using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface ITeamService
{
    Task<List<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(int id);
    Task<Team> CreateAsync(Team team, int userId, string userRole);
    Task<bool> UpdateAsync(int id, Team team, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);
}

public class TeamService : ITeamService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;

    public TeamService(AppDbContext context, ILoggerService loggerService)
    {
        _context = context;
        _loggerService = loggerService;
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

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "CREATE",
            EntityType = "Team",
            EntityId = team.Id,
            EntityName = team.Description ?? "Unnamed Team",
            Details = $"{userRole} (ID:{userId}) created team '{team.Description}'"
        });

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

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "UPDATE",
            EntityType = "Team",
            EntityId = id,
            EntityName = team.Description ?? "Unnamed Team",
            Details = $"{userRole} (ID:{userId}) updated team '{team.Description}'"
        });

        return true;
    }

    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return false;

        var teamDescription = team.Description ?? "Unnamed Team";

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "DELETE",
            EntityType = "Team",
            EntityId = id,
            EntityName = teamDescription,
            Details = $"{userRole} (ID:{userId}) deleted team '{teamDescription}'"
        });

        return true;
    }
}