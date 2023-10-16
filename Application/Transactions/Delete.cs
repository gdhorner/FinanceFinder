using MediatR;
using Persistence;

namespace Application.Transactions
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var transaction = await _context.Transactions.FindAsync(request.Id);

                _context.Remove(transaction);

                await _context.SaveChangesAsync();
            }
        }
    }
}