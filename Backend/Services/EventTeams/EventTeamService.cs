using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Services;

public interface IEventTeamService
{
    Task<List<EventTeam>> GetAllAsync();
    Task<EventTeam?> GetByIdAsync(int id);
    Task<EventTeam> CreateAsync(EventTeam eventTeam, int userId, string userRole);
    Task<bool> UpdateAsync(int id, EventTeam eventTeam, int userId, string userRole);
    Task<bool> DeleteAsync(int id, int userId, string userRole);
}

public class EventTeamService : IEventTeamService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;

    public EventTeamService(AppDbContext context, ILoggerService loggerService)
    {
        _context = context;
        _loggerService = loggerService;
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
    public async Task<EventTeam> CreateAsync(EventTeam eventTeam, int userId, string userRole)
    {
        var eventExists = await _context.Events.AnyAsync(e => e.Id == eventTeam.EventId);
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == eventTeam.TeamId);

        if (!eventExists) throw new KeyNotFoundException($"Event with id {eventTeam.EventId} not found");
        if (!teamExists) throw new KeyNotFoundException($"Team with id {eventTeam.TeamId} not found");

        var alreadyLinked = await _context.EventTeams.AnyAsync(et =>
            et.EventId == eventTeam.EventId && et.TeamId == eventTeam.TeamId);
        if (alreadyLinked) throw new InvalidOperationException("This team is already linked to this event");

        _context.EventTeams.Add(eventTeam);
        await _context.SaveChangesAsync();

        // Load related entities for logging
        await _context.Entry(eventTeam).Reference(et => et.Event).LoadAsync();
        await _context.Entry(eventTeam).Reference(et => et.Team).LoadAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "CREATE",
            EntityType = "EventTeam",
            EntityId = eventTeam.Id,
            EntityName = $"Event '{eventTeam.Event?.Title}' + Team '{eventTeam.Team?.Description}'",
            Details = $"{userRole} (ID:{userId}) added team '{eventTeam.Team?.Description}' to event '{eventTeam.Event?.Title}'"
        });

        return eventTeam;
    }
    // update event team if it exists
    public async Task<bool> UpdateAsync(int id, EventTeam data, int userId, string userRole)
    {
        var eventTeam = await _context.EventTeams.FindAsync(id);
        if (eventTeam == null) return false;

        var eventExists = await _context.Events.AnyAsync(e => e.Id == data.EventId);
        var teamExists = await _context.Teams.AnyAsync(t => t.Id == data.TeamId);

        if (!eventExists) throw new KeyNotFoundException($"Event with id {data.EventId} not found");
        if (!teamExists) throw new KeyNotFoundException($"Team with id {data.TeamId} not found");

        var alreadyLinked = await _context.EventTeams.AnyAsync(et =>
            et.Id != id && et.EventId == data.EventId && et.TeamId == data.TeamId);
        if (alreadyLinked) throw new InvalidOperationException("This team is already linked to this event");

        eventTeam.EventId = data.EventId;
        eventTeam.TeamId = data.TeamId;

        await _context.SaveChangesAsync();

        // Load related entities for logging
        await _context.Entry(eventTeam).Reference(et => et.Event).LoadAsync();
        await _context.Entry(eventTeam).Reference(et => et.Team).LoadAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "UPDATE",
            EntityType = "EventTeam",
            EntityId = id,
            EntityName = $"Event '{eventTeam.Event?.Title}' + Team '{eventTeam.Team?.Description}'",
            Details = $"{userRole} (ID:{userId}) updated event-team relationship"
        });

        return true;
    }
    // delete event team by id
    public async Task<bool> DeleteAsync(int id, int userId, string userRole)
    {
        var eventTeam = await _context.EventTeams
            .Include(et => et.Event)
            .Include(et => et.Team)
            .FirstOrDefaultAsync(et => et.Id == id);
        if (eventTeam == null) return false;

        var eventName = eventTeam.Event?.Title ?? "Unknown Event";
        var teamName = eventTeam.Team?.Description ?? "Unknown Team";

        _context.EventTeams.Remove(eventTeam);
        await _context.SaveChangesAsync();

        // Log the action
        await _loggerService.CreateAsync(new Logger
        {
            UserId = userId,
            UserRole = userRole,
            Action = "DELETE",
            EntityType = "EventTeam",
            EntityId = id,
            EntityName = $"Event '{eventName}' + Team '{teamName}'",
            Details = $"{userRole} (ID:{userId}) removed team '{teamName}' from event '{eventName}'"
        });

        return true;
    }
}