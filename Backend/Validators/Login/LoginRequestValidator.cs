using Backend.Models;
using FluentValidation;

namespace Backend.Validators.Login;

/// <summary>
/// Validator for login requests using FluentValidation.
/// Ensures email and password meet the required criteria before authentication.
/// </summary>
public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    /// <summary>
    /// Initializes validation rules for login requests.
    /// </summary>
    /// <remarks>
    /// Validation rules:
    /// - Email: Required and must be valid email format
    /// - Password: Required and minimum 4 characters
    /// </remarks>
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(4).WithMessage("Password must be at least 4 characters long.");
    }
}