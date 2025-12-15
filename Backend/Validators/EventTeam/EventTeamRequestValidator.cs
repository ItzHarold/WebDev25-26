using Backend.Data;
using Backend.Models;
using FluentValidation;

namespace Backend.Validators.EventTeam;

public class EventTeamRequestValidator : AbstractValidator<EventTeamRequest>
{
    public EventTeamRequestValidator(AppDbContext db)
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("EventId is required.")
            .GreaterThan(0).WithMessage("EventId must be greater than zero.");
        RuleFor(x => x.TeamId)
            .NotEmpty().WithMessage("TeamId is required.")
            .GreaterThan(0).WithMessage("TeamId must be greater than zero.");
        
    }
}