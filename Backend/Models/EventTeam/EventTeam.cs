using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Backend.Models;

/// <summary>
/// Junction entity representing the many-to-many relationship between Events and Teams.
/// Links teams to the events they are participating in.
/// </summary>
public class EventTeam
{
    /// <summary>
    /// Unique identifier for the event-team relationship.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the event.
    /// </summary>
    public int EventId { get; set; }

    /// <summary>
    /// Navigation property for the related event.
    /// Ignored in JSON serialization to prevent circular references.
    /// </summary>
    [JsonIgnore]
    [ValidateNever]
    public Event? Event { get; set; } = null!;

    /// <summary>
    /// The ID of the team participating in the event.
    /// </summary>
    public int TeamId { get; set; }

    /// <summary>
    /// Navigation property for the related team.
    /// Ignored in JSON serialization to prevent circular references.
    /// </summary>
    [JsonIgnore]
    [ValidateNever]
    public Team? Team { get; set; } = null!;
}

/// <summary>
/// Request model for adding a team to an event.
/// </summary>
public class EventTeamRequest
{
    /// <summary>
    /// The ID of the event to add the team to.
    /// </summary>
    public int EventId { get; set; }

    /// <summary>
    /// The ID of the team to add to the event.
    /// </summary>
    public int TeamId { get; set; }
}

/// <summary>
/// Response model containing event-team relationship data with expanded event and team details.
/// </summary>
public class EventTeamResponse
{
    /// <summary>
    /// Unique identifier for the event-team relationship.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The event details.
    /// </summary>
    public EventResponse? Event { get; set; }

    /// <summary>
    /// The team details.
    /// </summary>
    public TeamResponse? Team { get; set; }
}