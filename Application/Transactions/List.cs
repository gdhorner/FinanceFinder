using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Transactions
{
    public class List
    {
        public class Query : IRequest<Result<List<Transaction>>> { }

        public class Handler : IRequestHandler<Query, Result<List<Transaction>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<Result<List<Transaction>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Transaction>>.Success(await _context.Transactions.ToListAsync());

            }
        }
    }
}