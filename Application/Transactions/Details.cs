using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Transactions
{
    public class Details
    {
        public class Query : IRequest<Result<Transaction>> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Transaction>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
                
            }

            public async Task<Result<Transaction>> Handle(Query request, CancellationToken cancellationToken)
            {
                var transaction = await _context.Transactions.FindAsync(request.Id);            
                return Result<Transaction>.Success(transaction);

            }

        }
    }
}