using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;
namespace Backend.Models;

public class EventTeam
{
    public int Id { get; set; }
    public int EventId { get; set; }
    [JsonIgnore]
    [ValidateNever]
    public Event? Event { get; set; } = null!;
    public int TeamId { get; set; }
    [JsonIgnore]
    [ValidateNever]
    public Team? Team { get; set; } = null!;
}
