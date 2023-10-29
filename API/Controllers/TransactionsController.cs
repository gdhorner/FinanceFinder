using Application.Transactions;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TransactionsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransaction(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(Transaction transaction)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Transaction = transaction }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(Guid id, Transaction transaction)
        {
            transaction.Id = id.ToString();
            return HandleResult(await Mediator.Send(new Edit.Command { Transaction = transaction }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}