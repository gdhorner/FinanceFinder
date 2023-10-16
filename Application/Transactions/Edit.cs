using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Transactions
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Transaction Transaction { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var transaction = await _context.Transactions.FindAsync(request.Transaction.Id);

                _mapper.Map(request.Transaction, transaction);

                await _context.SaveChangesAsync();
            }
        }
    }
}