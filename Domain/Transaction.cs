namespace Domain
{
    public class Transaction{
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public double Amount { get; set; }
    }
}
