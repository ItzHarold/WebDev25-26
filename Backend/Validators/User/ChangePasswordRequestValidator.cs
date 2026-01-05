using Backend.Models;
using FluentValidation;

namespace Backend.Validators.User;

/// <summary>
/// Validator for password change requests using FluentValidation.
/// Ensures the request contains valid user ID and password fields.
/// </summary>
/// <remarks>
/// Validation rules:
/// - UserId: Required, must be greater than 0
/// - CurrentPassword: Required (actual verification done in service layer)
/// - NewPassword: Required, minimum 4 characters
/// </remarks>
public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    /// <summary>
    /// Initializes validation rules for password change requests.
    /// </summary>
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId is required.");

        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(4).WithMessage("New password must be at least 4 characters long.");
    }
}