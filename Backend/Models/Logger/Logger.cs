using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Logger
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public string Action { get; set; } = null!; // CREATE, UPDATE, DELETE

    [Required]
    public string EntityType { get; set; } = null!; // User, Team, Event

    [Required]
    public int EntityId { get; set; }

    public string? Details { get; set; } // Additional info

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LoggerResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public int EntityId { get; set; }
    public string? Details { get; set; }
    public DateTime CreatedAt { get; set; }
}
