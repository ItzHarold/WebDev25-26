using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Services;

public interface IEventTeamService
{
    Task<List<EventTeam>> GetAllAsync();
    Task<EventTeam?> GetByIdAsync(int id);
    Task<EventTeam> CreateAsync(EventTeam eventTeam);
    Task<bool> UpdateAsync(int id, EventTeam eventTeam);
    Task<bool> DeleteAsync(int id);
}

public class EventTeamService : IEventTeamService
{
    private readonly AppDbContext _context;

    public EventTeamService(AppDbContext context)
    {
        _context = context;
    }
    // get all event teams
    public Task<List<EventTeam>> GetAllAsync()
    {
        return _context.EventTeams
            .Include(et => et.Event)
            .Include(et => et.Team)
            .ToListAsync();
    }
    // find event team by id
    public Task<EventTeam?> GetByIdAsync(int id)
    {
        return _context.EventTeams
            .Include(et => et.Event)
            .Include(et => et.Team)
            .FirstOrDefaultAsync(et => et.Id == id);
    }
    // create new event team
    public async Task<EventTeam> CreateAsync(EventTeam eventTeam)
    {
        _context.EventTeams.Add(eventTeam);
        await _context.SaveChangesAsync();
        return eventTeam;
    }
    // update event team if it exists
    public async Task<bool> UpdateAsync(int id, EventTeam data)
    {
        var eventTeam = await _context.EventTeams.FindAsync(id);
        if (eventTeam == null) return false;

        eventTeam.EventId = data.EventId;
        eventTeam.TeamId = data.TeamId;

        await _context.SaveChangesAsync();
        return true;
    }
    // delete event team by id
    public async Task<bool> DeleteAsync(int id)
    {
        var eventTeam = await _context.EventTeams.FindAsync(id);
        if (eventTeam == null) return false;

        _context.EventTeams.Remove(eventTeam);
        await _context.SaveChangesAsync();
        return true;
    }
    
}