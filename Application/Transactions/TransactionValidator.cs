using Domain;
using FluentValidation;

namespace Application.Transactions
{
    public class TransactionValidator : AbstractValidator<Transaction>
    {
        public TransactionValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Amount).NotEmpty();
        }
    }
}