namespace Domain
{
    public class Transaction{
        public string Id { get; set; }
        public string AccountId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string Category { get; set; }
        public double Amount { get; set; }
        public Boolean IsDisabled {get; set;}
    }
}
