using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context){
            if(context.Transactions.Any()) return;

            var transactions = new List<Transaction>{
                new Transaction{
                    Id = new Guid(),
                    AccountId = new Guid(),
                    Name = "Walmart",
                    CategoryId = new Guid(),
                    Date = DateTime.UtcNow.AddDays(1),
                    Amount = 104.23
                },
                new Transaction{
                    Id = new Guid(),
                    AccountId = new Guid(),
                    Name = "Target",
                    CategoryId = new Guid(),
                    Date = DateTime.UtcNow.AddDays(31),
                    Amount = 22.23
                },
                new Transaction{
                    Id = new Guid(),
                    AccountId = new Guid(),
                    Name = "Dunkin",
                    CategoryId = new Guid(),
                    Date = DateTime.UtcNow.AddDays(-23),
                    Amount = 15.27
                },
                new Transaction{
                    Id = new Guid(),
                    AccountId = new Guid(),
                    Name = "Costco",
                    CategoryId = new Guid(),
                    Date = DateTime.UtcNow.AddDays(4),
                    Amount = 210.23
                },
                new Transaction{
                    Id = new Guid(),
                    AccountId = new Guid(),
                    Name = "Mcdonalds",
                    CategoryId = new Guid(),
                    Date = DateTime.UtcNow.AddDays(-5),
                    Amount = 13.23
                },
            };

            await context.Transactions.AddRangeAsync(transactions);
            await context.SaveChangesAsync();
        }
    }
}