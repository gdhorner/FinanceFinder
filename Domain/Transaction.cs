namespace Domain
{
    public class Transaction{
        public Guid Id { get; set; }
        public Guid AccountId {get; set; }
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
        public DateTime Date { get; set; }
        public double Amount { get; set; }
    }
}
