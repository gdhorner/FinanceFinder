using Application.Transactions;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class TransactionsController : BaseApiController
    {
        [HttpGet] //api/transactions
        public async Task<ActionResult<List<Transaction>>> GetTransactions(){
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/transactions/{id}
        public async Task<ActionResult<Transaction>> GetTransaction(Guid id){
            return await Mediator.Send(new Details.Query{ID = id});
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(Transaction transaction)
        {
            await Mediator.Send(new Create.Command {Transaction = transaction});

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTransaction(Guid id, Transaction transaction)
        {
            transaction.Id = id;
            await Mediator.Send(new Edit.Command {Transaction = transaction});

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(Guid id)
        {
            await Mediator.Send(new Delete.Command {Id = id});

            return Ok();
        }
        
    }
}