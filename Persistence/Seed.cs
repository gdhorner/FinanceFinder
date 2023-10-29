using Domain;

namespace Persistence
{
    public class Seed
    {

        public static async Task SeedData(DataContext context)
        {
            if (context.Accounts.Any()) return;
            
            var accounts = new List<Account>
            {
                new Account
                {
                    Id = "1",
                    Name = "Chase",
                    Type = "Credit Card"
                },
                new Account
                {
                    Id = "2",
                    Name = "Amex",
                    Type = "Credit Card"
                },
                new Account
                {
                    Id = "3",
                    Name = "Citi",
                    Type = "Credit Card"
                },
                new Account
                {
                    Id = "4",
                    Name = "Bank",
                    Type = "Checking"
                }
            };

            await context.Accounts.AddRangeAsync(accounts);
            await context.SaveChangesAsync();

            if (context.Transactions.Any()) return;
            
            var transactions = new List<Transaction>
            {
                new Transaction
                {
                    Id = "11",
                    AccountId = "1",
                    Date = DateTime.UtcNow.AddDays(1),
                    Name = "Walmart",
                    Note = "",
                    Category = "Grocery",
                    Amount = 104.23,
                    IsDisabled = true
                },
                new Transaction
                {
                    Id = "12",
                    AccountId = "2",
                    Date = DateTime.UtcNow.AddDays(2),
                    Name = "Panda",
                    Note = "",
                    Category = "Outside Food",
                    Amount = 44.23,
                    IsDisabled = true
                },
                new Transaction
                {
                    Id = "13",
                    AccountId = "4",
                    Date = DateTime.UtcNow.AddDays(1),
                    Name = "Rent",
                    Note = "",
                    Category = "Bills",
                    Amount = 1200,
                    IsDisabled = true
                },
                new Transaction
                {
                    Id = "14",
                    AccountId = "3",
                    Date = DateTime.UtcNow.AddDays(1),
                    Name = "Costco Gas",
                    Note = "",
                    Category = "Gas",
                    Amount = 33.23,
                    IsDisabled = true
                }
            };

            
            await context.Transactions.AddRangeAsync(transactions);
            await context.SaveChangesAsync();
        }
    }
}