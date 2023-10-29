using Application.Accounts;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount(Account account)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Account = account }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(Guid id, Account account)
        {
            account.Id = id.ToString();
            return HandleResult(await Mediator.Send(new Edit.Command { Account = account }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}