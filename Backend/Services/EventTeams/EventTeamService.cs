using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for managing event-team relationships.
/// </summary>
public interface IEventTeamService
{
    /// <summary>
    /// Retrieves all event-team relationships with related event and team data.
    /// </summary>
    Task<List<EventTeam>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific event-team relationship by its ID.
    /// </summary>
    Task<EventTeam?> GetByIdAsync(int id);

    /// <summary>
    /// Creates a new event-team relationship (adds a team to an event).
    /// </summary>
    Task<EventTeam> CreateAsync(EventTeam eventTeam, int userId, string userRole);

    /// <summary>
    /// Updates an existing event-team relationship.
    /// </summary>
    Task<bool> UpdateAsync(int id, EventTeam eventTeam, int userId, string userRole);

    /// <summary>
    /// Deletes an event-team relationship (removes a team from an event).
    /// </summary>
    Task<bool> DeleteAsync(int id, int userId, string userRole);
}

/// <summary>
/// Service responsible for managing the many-to-many relationship between events and teams.
/// Handles adding/removing teams from events with validation and audit logging.
/// </summary>
public class EventTeamService : IEventTeamService
{
    private readonly AppDbContext _context;
    private readonly ILoggerService _loggerService;

    /// <summary>
    /// Initializes a new instance of the EventTeamService.
    /// </summary>
    /// <param name="context">Database context for data access</param>
    /// <param name="loggerService">Service for audit logging</param>
    public EventTeamService(AppDbContext context, ILoggerService loggerService)
    {
        _context = context;
        _loggerService = loggerService;
    }

    /// <summary>
    /// Retrieves all event-team relationships including related event and team data.
    /// </summary>
    /// <returns>A list of all event-team relationships with navigation properties loaded</returns>
    public Task<List<EventTeam>> GetAllAsync()
    {
        return _context.EventTeams
            .Include(et => et.Event)
            .Include(et => et.Team)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific event-team relationship by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the relationship</param>
    /// <returns>The event-team relationship if found, null otherwise</returns>
    public Task<EventTeam?> GetByIdAsync(int id)
    {
        return _context.EventTeams
            .Include(et => et.Event)
            .Include(et => et.Team)
            .FirstOrDefaultAsync(et => et.Id == id);
    }

    /// <summary>
    /// Creates a new event-team relationship (adds a team to an event).
    /// Validates that both event and team exist, and that they're not already linked.
    /// </summary>
    /// <param name="eventTeam">The relationship data to create</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>The created event-team relationship</returns>
    /// <exception cref="KeyNotFoundException">Thrown when event or team does not exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when team is already linked to the event</exception>
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
            EntityName = $"Event '{eventTeam.Event?.Title}' + Team '{eventTeam.Team?.Description}'",
            Details = $"{userRole} (ID:{userId}) added team '{eventTeam.Team?.Description}' to event '{eventTeam.Event?.Title}'"
        });

        return eventTeam;
    }

    /// <summary>
    /// Updates an existing event-team relationship.
    /// Validates that the new event and team exist, and that they're not already linked.
    /// </summary>
    /// <param name="id">The ID of the relationship to update</param>
    /// <param name="data">The new relationship data</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if update succeeded, false if relationship not found</returns>
    /// <exception cref="KeyNotFoundException">Thrown when event or team does not exist</exception>
    /// <exception cref="InvalidOperationException">Thrown when team is already linked to the event</exception>
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
            EntityName = $"Event '{eventTeam.Event?.Title}' + Team '{eventTeam.Team?.Description}'",
            Details = $"{userRole} (ID:{userId}) updated event-team relationship"
        });

        return true;
    }

    /// <summary>
    /// Deletes an event-team relationship (removes a team from an event).
    /// </summary>
    /// <param name="id">The ID of the relationship to delete</param>
    /// <param name="userId">ID of the user performing the action (for audit)</param>
    /// <param name="userRole">Role of the user performing the action (for audit)</param>
    /// <returns>True if deletion succeeded, false if relationship not found</returns>
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
            EntityName = $"Event '{eventName}' + Team '{teamName}'",
            Details = $"{userRole} (ID:{userId}) removed team '{teamName}' from event '{eventName}'"
        });

        return true;
    }
}
