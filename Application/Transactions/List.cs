using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Transactions
{
    public class List
    {
        public class Query : IRequest<List<Transaction>> {}

        public class Handler : IRequestHandler<Query, List<Transaction>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;
                
            }

            public async Task<List<Transaction>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Transactions.ToListAsync();
            }
        }
    }
}