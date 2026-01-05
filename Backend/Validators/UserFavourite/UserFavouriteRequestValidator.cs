using Backend.Models;
using FluentValidation;

namespace Backend.Validators.UserFavourite;

/// <summary>
/// Validator for user favourite requests using FluentValidation.
/// Ensures both user and event IDs are valid.
/// </summary>
/// <remarks>
/// Validation rules:
/// - UserId: Required, must be greater than 0
/// - EventId: Required, must be greater than 0
/// 
/// Note: Actual existence validation of user/event is done in the service layer.
/// </remarks>
public class UserFavouriteRequestValidator : AbstractValidator<UserFavouriteRequest>
{
    /// <summary>
    /// Initializes validation rules for user favourite requests.
    /// </summary>
    public UserFavouriteRequestValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.")
            .GreaterThan(0).WithMessage("UserId must be greater than zero.");
            
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("EventId is required.")
            .GreaterThan(0).WithMessage("EventId must be greater than zero.");
    }
}