using Domain;
using MediatR;
using Persistence;

namespace Application.Transactions
{
    public class Create
    {
        public class Command : IRequest
        {
            public Transaction Transaction { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;

            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Transactions.Add(request.Transaction);

                await _context.SaveChangesAsync();
            }
        }
    }
}