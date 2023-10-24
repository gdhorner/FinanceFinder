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
                    Name = "Walmart",
                    Date = DateTime.UtcNow.AddDays(1),
                    Amount = 104.23,
                    IsDisabled = true
                },
                new Transaction{
                    Id = new Guid(),
                    Name = "Target",
                    Date = DateTime.UtcNow.AddDays(31),
                    Amount = 22.23,
                    IsDisabled = true
                },
                new Transaction{
                    Id = new Guid(),
                    Name = "Dunkin",
                    Date = DateTime.UtcNow.AddDays(-23),
                    Amount = 15.27,
                    IsDisabled = true
                },
                new Transaction{
                    Id = new Guid(),
                    Name = "Costco",
                    Date = DateTime.UtcNow.AddDays(4),
                    Amount = 210.23,
                    IsDisabled = true
                },
                new Transaction{
                    Id = new Guid(),
                    Name = "Mcdonalds",
                    Date = DateTime.UtcNow.AddDays(-5),
                    Amount = 13.23,
                    IsDisabled = true
                },
            };

            await context.Transactions.AddRangeAsync(transactions);
            await context.SaveChangesAsync();
        }
    }
}