using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    
    public class TransactionsController : BaseApiController
    {
        private readonly DataContext _context;
        public TransactionsController(DataContext context)
        {
            _context = context;
            
        }

        [HttpGet] //api/transactions
        public async Task<ActionResult<List<Transaction>>> GetTransactions(){
            return await _context.Transactions.ToListAsync();
        }

        [HttpGet("{id}")] //api/transactions/{id}
        public async Task<ActionResult<Transaction>> GetTransaction(Guid id){
            return await _context.Transactions.FindAsync(id);
        }
        
    }
}