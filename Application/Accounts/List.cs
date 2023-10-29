using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Accounts
{
    public class List
    {
        public class Query : IRequest<Result<List<Account>>> { }

        public class Handler : IRequestHandler<Query, Result<List<Account>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<Result<List<Account>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Account>>.Success(await _context.Accounts.ToListAsync());

            }
        }
    }
}