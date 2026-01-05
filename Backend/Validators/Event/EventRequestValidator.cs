using FluentValidation;
using Backend.Models;

namespace Backend.Validators.Event;

/// <summary>
/// Validator for event creation and update requests using FluentValidation.
/// Ensures all event fields meet the required criteria.
/// </summary>
/// <remarks>
/// Validation rules:
/// - Title: Required, max 100 characters
/// - Location: Required, max 200 characters
/// - Date: Required
/// - Description: Optional, max 500 characters
/// - Detail: Optional, max 2000 characters
/// - Status: Required, must be one of: Live, Upcoming, Ended
/// - ImageUrl: Optional, max 300 characters
/// </remarks>
public class EventRequestValidator : AbstractValidator<EventRequest>
{
    /// <summary>
    /// Initializes validation rules for event requests.
    /// </summary>
    public EventRequestValidator()
    {
        RuleFor(e => e.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(e => e.Location)
            .NotEmpty().WithMessage("Location is required.")
            .MaximumLength(200).WithMessage("Location cannot exceed 200 characters.");

        RuleFor(e => e.Date)
            .NotEmpty().WithMessage("Date is required.");

        RuleFor(e => e.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(e => e.Detail)
            .MaximumLength(2000).WithMessage("Detail cannot exceed 2000 characters.");

        RuleFor(e => e.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(status => !string.IsNullOrEmpty(status) && 
                new[] { "live", "upcoming", "ended"}
                .Contains(status.ToLower()))
            .WithMessage("Status must be one of the following: Live, Upcoming or Ended.");

        RuleFor(e => e.ImageUrl)
            .MaximumLength(300).WithMessage("ImageUrl cannot exceed 300 characters.");
    }
}