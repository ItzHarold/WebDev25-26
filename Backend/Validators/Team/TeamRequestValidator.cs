using Backend.Data; 
using FluentValidation;
using Backend.Models;

namespace Backend.Validators.Team;

public class TeamRequestValidator : AbstractValidator<TeamRequest>
{
    public TeamRequestValidator(AppDbContext db)
    {
        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Description cannot exceed 200 characters.");

        RuleFor(x => x.Points)
            .GreaterThanOrEqualTo(0).WithMessage("Points must be a non-negative integer.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(200).WithMessage("ImageUrl cannot exceed 200 characters.");

        RuleFor(x => x.ManagerId)
            .GreaterThan(0).WithMessage("ManagerId must be greater than 0.");
    }
}