namespace Backend.Models;

/// <summary>
/// Entity model representing an esports team.
/// </summary>
public class Team
{
    /// <summary>
    /// Unique identifier for the team.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Description or name of the team.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Total points accumulated by the team from competitions.
    /// </summary>
    public int Points { get; set; }

    /// <summary>
    /// URL to the team's logo or image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// The user ID of the team's manager.
    /// </summary>
    public int ManagerId { get; set; }

    /// <summary>
    /// Navigation property for players belonging to this team.
    /// </summary>
    public ICollection<User> Players { get; set; } = new List<User>();

    /// <summary>
    /// Navigation property for events this team is participating in.
    /// </summary>
    public ICollection<EventTeam> EventTeams { get; set; } = new List<EventTeam>();
}

/// <summary>
/// Request model for creating or updating a team.
/// </summary>
public class TeamRequest
{
    /// <summary>
    /// Description or name of the team.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Total points for the team.
    /// </summary>
    public int Points { get; set; }

    /// <summary>
    /// URL to the team's logo or image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// The user ID of the team's manager.
    /// </summary>
    public int ManagerId { get; set; }
}

/// <summary>
/// Response model containing team data returned from API endpoints.
/// </summary>
public class TeamResponse
{
    /// <summary>
    /// Unique identifier for the team.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Description or name of the team.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Total points accumulated by the team.
    /// </summary>
    public int Points { get; set; }

    /// <summary>
    /// URL to the team's logo or image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// The user ID of the team's manager.
    /// </summary>
    public int ManagerId { get; set; }
}

/// <summary>
/// Request model for uploading a team image.
/// </summary>
public class TeamImageUploadRequest
{
    /// <summary>
    /// The ID of the team to update the image for.
    /// </summary>
    public int TeamId { get; set; }

    /// <summary>
    /// The image file to upload.
    /// </summary>
    public IFormFile? ImageUrl { get; set; }
}
