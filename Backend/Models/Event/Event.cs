namespace Backend.Models;

/// <summary>
/// Entity model representing an esports event/tournament.
/// </summary>
public class Event
{
    /// <summary>
    /// Unique identifier for the event.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The title/name of the event.
    /// </summary>
    public string Title { get; set; } = null!;

    /// <summary>
    /// The physical or virtual location where the event takes place.
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// The date and time when the event occurs.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// A brief description of the event.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Additional detailed information about the event.
    /// </summary>
    public string? Detail { get; set; }

    /// <summary>
    /// Current status of the event (e.g., "Active", "Upcoming", "Ended", "Live").
    /// </summary>
    public string Status { get; set; } = null!;

    /// <summary>
    /// URL to the event's promotional image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Navigation property for teams participating in this event.
    /// </summary>
    public ICollection<EventTeam> EventTeams { get; set; } = new List<EventTeam>();

    /// <summary>
    /// Navigation property for users who have favourited this event.
    /// </summary>
    public ICollection<UserFavourite> FavouritedByUsers { get; set; } = new List<UserFavourite>();
}

/// <summary>
/// Request model for creating or updating an event.
/// </summary>
public class EventRequest
{
    /// <summary>
    /// The title/name of the event.
    /// </summary>
    public string Title { get; set; } = null!;

    /// <summary>
    /// The physical or virtual location where the event takes place.
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// The date and time when the event occurs.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// A brief description of the event.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Additional detailed information about the event.
    /// </summary>
    public string? Detail { get; set; }

    /// <summary>
    /// Current status of the event (e.g., "Active", "Upcoming", "Ended", "Live").
    /// </summary>
    public string Status { get; set; } = null!;

    /// <summary>
    /// URL to the event's promotional image.
    /// </summary>
    public string? ImageUrl { get; set; }
}

/// <summary>
/// Response model containing event data returned from API endpoints.
/// </summary>
public class EventResponse
{
    /// <summary>
    /// Unique identifier for the event.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The title/name of the event.
    /// </summary>
    public string Title { get; set; } = null!;

    /// <summary>
    /// The physical or virtual location where the event takes place.
    /// </summary>
    public string? Location { get; set; }

    /// <summary>
    /// The date and time when the event occurs.
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// A brief description of the event.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Additional detailed information about the event.
    /// </summary>
    public string? Detail { get; set; }

    /// <summary>
    /// Current status of the event (e.g., "Active", "Upcoming", "Ended", "Live").
    /// </summary>
    public string Status { get; set; } = null!;

    /// <summary>
    /// URL to the event's promotional image.
    /// </summary>
    public string? ImageUrl { get; set; }
}

/// <summary>
/// Request model for uploading an event image.
/// </summary>
public class EventImageUploadRequest
{
    /// <summary>
    /// The ID of the event to update the image for.
    /// </summary>
    public int EventId { get; set; }

    /// <summary>
    /// The image file to upload.
    /// </summary>
    public IFormFile? ImageUrl { get; set; }
}
