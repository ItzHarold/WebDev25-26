using Backend.Models;
using Backend.Data;
using FluentValidation;

namespace Backend.Validators.UserFavourite;

public class UserFavouriteRequestValidator : AbstractValidator<UserFavouriteRequest>
{
    public UserFavouriteRequestValidator(AppDbContext db)
    {

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.")
            .GreaterThan(0).WithMessage("UserId must be greater than zero.");
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("EventId is required.")
            .GreaterThan(0).WithMessage("EventId must be greater than zero.");
    }
}