using Domain;
using MediatR;
using Persistence;

namespace Application.Transactions
{
    public class Details
    {
        public class Query : IRequest<Transaction> 
        {
            public Guid ID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Transaction>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
                
            }

            public async Task<Transaction> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Transactions.FindAsync(request.ID);            
            }

        }
    }
}