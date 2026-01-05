namespace Backend.Models;

/// <summary>
/// Junction entity representing a user's favourite events.
/// Links users to the events they have marked as favourites.
/// </summary>
public class UserFavourite
{
    /// <summary>
    /// Unique identifier for the favourite relationship.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the user who favourited the event.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Navigation property for the user.
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// The ID of the favourited event.
    /// </summary>
    public int EventId { get; set; }

    /// <summary>
    /// Navigation property for the favourited event.
    /// </summary>
    public Event Event { get; set; } = null!;
}

/// <summary>
/// Request model for adding or removing an event from favourites.
/// </summary>
public class UserFavouriteRequest
{
    /// <summary>
    /// The ID of the user.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The ID of the event to favourite/unfavourite.
    /// </summary>
    public int EventId { get; set; }
}

/// <summary>
/// Response model containing favourite relationship data.
/// </summary>
public class UserFavouriteResponse
{
    /// <summary>
    /// Unique identifier for the favourite relationship.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the user who favourited the event.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// The ID of the favourited event.
    /// </summary>
    public int EventId { get; set; }
}