using FluentValidation;
using Backend.Models;

namespace Backend.Validators.Team;

/// <summary>
/// Validator for team creation and update requests using FluentValidation.
/// Ensures all team fields meet the required criteria.
/// </summary>
/// <remarks>
/// Validation rules:
/// - Description: Optional, max 200 characters
/// - Points: Must be non-negative (>= 0)
/// - ImageUrl: Optional, max 200 characters
/// - ManagerId: Required, must be greater than 0
/// </remarks>
public class TeamRequestValidator : AbstractValidator<TeamRequest>
{
    /// <summary>
    /// Initializes validation rules for team requests.
    /// </summary>
    public TeamRequestValidator()
    {
        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Description cannot exceed 200 characters.");

        RuleFor(x => x.Points)
            .GreaterThanOrEqualTo(0).WithMessage("Points must be a non-negative integer.");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(200).WithMessage("ImageUrl cannot exceed 200 characters.");

        RuleFor(x => x.ManagerId)
            .NotEmpty().WithMessage("ManagerId is required.")
            .GreaterThan(0).WithMessage("ManagerId must be greater than 0.");
    }
}