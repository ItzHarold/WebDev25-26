using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface ITeamService
{
    Task<List<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(int id);
    Task<Team> CreateAsync(Team team);
    Task<bool> UpdateAsync(int id, Team team);
    Task<bool> DeleteAsync(int id);
}

public class TeamService : ITeamService
{
    private readonly AppDbContext _context;

    public TeamService(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Team>> GetAllAsync()
    {
        return _context.Teams.ToListAsync();
    }

    public Task<Team?> GetByIdAsync(int id)
    {
        return _context.Teams.FindAsync(id).AsTask();
    }

    public async Task<Team> CreateAsync(Team team)
    {
        var isManager = await _context.Users.AnyAsync(u => u.Id == team.ManagerId && u.Role == "Manager");
        if (!isManager)
            throw new InvalidOperationException($"User {team.ManagerId} is not a manager");

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return team;
    }

    public async Task<bool> UpdateAsync(int id, Team data)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return false;

        var isManager = await _context.Users.AnyAsync(u => u.Id == data.ManagerId && u.Role == "Manager");
        if (!isManager)
            throw new InvalidOperationException($"User {data.ManagerId} is not a manager");


        team.Description = data.Description;
        team.Points = data.Points;
        team.ImageUrl = data.ImageUrl;
        team.ManagerId = data.ManagerId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return false;

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return true;
    }
}