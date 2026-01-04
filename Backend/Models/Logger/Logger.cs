using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <summary>
/// Entity model for audit logging of user actions in the system.
/// Tracks CREATE, UPDATE, and DELETE operations on entities.
/// </summary>
public class Logger
{
    /// <summary>
    /// Unique identifier for the log entry.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the user who performed the action.
    /// </summary>
    [Required]
    public int UserId { get; set; }

    /// <summary>
    /// The role of the user at the time of the action (e.g., "admin", "manager").
    /// </summary>
    [Required]
    public string UserRole { get; set; } = null!;

    /// <summary>
    /// The type of action performed. Valid values: "CREATE", "UPDATE", "DELETE".
    /// </summary>
    [Required]
    public string Action { get; set; } = null!;

    /// <summary>
    /// The type of entity affected. Valid values: "User", "Team", "Event".
    /// </summary>
    [Required]
    public string EntityType { get; set; } = null!;

    /// <summary>
    /// The name or identifier of the affected entity (e.g., event title, team name).
    /// </summary>
    [Required]
    public string EntityName { get; set; } = null!;

    /// <summary>
    /// Additional details about the action (optional).
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// Timestamp when the action was performed.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Response model containing log entry data returned from API endpoints.
/// </summary>
public class LoggerResponse
{
    /// <summary>
    /// Unique identifier for the log entry.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the user who performed the action.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The role of the user at the time of the action.
    /// </summary>
    public string UserRole { get; set; } = null!;

    /// <summary>
    /// The type of action performed (CREATE, UPDATE, DELETE).
    /// </summary>
    public string Action { get; set; } = null!;

    /// <summary>
    /// The type of entity affected (User, Team, Event).
    /// </summary>
    public string EntityType { get; set; } = null!;

    /// <summary>
    /// The name or identifier of the affected entity.
    /// </summary>
    public string EntityName { get; set; } = null!;

    /// <summary>
    /// Additional details about the action.
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// Timestamp when the action was performed.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
