using Backend.Models;
using FluentValidation;

namespace Backend.Validators.Register;

/// <summary>
/// Validator for registration requests using FluentValidation.
/// Ensures all required fields are present and meet validation criteria.
/// </summary>
public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    /// <summary>
    /// Initializes validation rules for registration requests.
    /// </summary>
    /// <remarks>
    /// Validation rules:
    /// - Role: Required, must be "player" or "manager"
    /// - FirstName: Required, max 50 characters
    /// - LastName: Required, max 50 characters
    /// - UserName: Required, max 50 characters
    /// - Email: Required, valid email format
    /// - Password: Required, minimum 4 characters
    /// - Dob: Required, must be in the past
    /// </remarks>
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required.")
            .Must(role => role == "player" || role == "manager")
            .WithMessage("Role must be either 'player' or 'manager'.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MaximumLength(50).WithMessage("Username cannot exceed 50 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(4).WithMessage("Password must be at least 4 characters long.");

        RuleFor(x => x.Dob)
            .NotEmpty().WithMessage("Date of birth is required.")
            .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.");
    }
}
