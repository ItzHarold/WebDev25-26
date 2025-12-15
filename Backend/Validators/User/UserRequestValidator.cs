using Backend.Models;
using FluentValidation;

namespace Backend.Validators.User;

public class UserRequestValidator : AbstractValidator<UserRequest>
{
    public UserRequestValidator()
    {
        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required.")
            .Must(role => role == "Player" || role == "Manager" || role == "Admin")
            .WithMessage("Role must be either 'Player','Manager' or 'Admin'.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MaximumLength(30).WithMessage("Username cannot exceed 30 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(4).WithMessage("Password must be at least 4 characters long.");

        RuleFor(x => x.Dob)
            .NotEmpty().WithMessage("Date of birth is required.")
            .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.")
            .Must(dob =>dob <= DateTime.Today.AddYears(-12))
            .WithMessage("User must be at least 12 years old.");
        RuleFor(x => x.TeamId)
            .GreaterThan(0).WithMessage("TeamId must be greater than zero.");
    }
}