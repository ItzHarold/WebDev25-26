using Backend.Models;
using FluentValidation;

namespace Backend.Validators.EventTeam;

/// <summary>
/// Validator for event-team relationship requests using FluentValidation.
/// Ensures both event and team IDs are valid.
/// </summary>
/// <remarks>
/// Validation rules:
/// - EventId: Required, must be greater than 0
/// - TeamId: Required, must be greater than 0
/// 
/// Note: Actual existence validation of event/team is done in the service layer.
/// </remarks>
public class EventTeamRequestValidator : AbstractValidator<EventTeamRequest>
{
    /// <summary>
    /// Initializes validation rules for event-team requests.
    /// </summary>
    public EventTeamRequestValidator()
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("EventId is required.")
            .GreaterThan(0).WithMessage("EventId must be greater than zero.");

        RuleFor(x => x.TeamId)
            .NotEmpty().WithMessage("TeamId is required.")
            .GreaterThan(0).WithMessage("TeamId must be greater than zero.");
    }
}