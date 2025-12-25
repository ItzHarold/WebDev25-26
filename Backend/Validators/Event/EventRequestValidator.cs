using FluentValidation;
using Backend.Models;

namespace Backend.Validators.Event;

public class EventRequestValidator : AbstractValidator<EventRequest>
{
    public EventRequestValidator()
    {
        RuleFor(e => e.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(e => e.Location)
            .NotEmpty().WithMessage("Location is required.")
            .MaximumLength(200).WithMessage("Location cannot exceed 200 characters.");

        RuleFor(e => e.Date)
            .NotEmpty().WithMessage("Date is required.")
            .GreaterThan(DateTime.Now).WithMessage("Date must be in the future.");

        RuleFor(e => e.Description)
        .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(e => e.Detail)
            .MaximumLength(2000).WithMessage("Detail cannot exceed 2000 characters.");

        RuleFor(e => e.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => new[] { "live", "upcoming", "ended", "Cancelled" }.Contains(status))
            .WithMessage("Status must be one of the following: live, upcoming, ended and Cancelled.");

        RuleFor(e => e.ImageUrl)
            .MaximumLength(300).WithMessage("ImageUrl cannot exceed 300 characters.");
    }
}