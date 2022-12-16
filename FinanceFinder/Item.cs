using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinanceFinder
{
    internal class Item
    {
        public string Name { get; set; }

        public string Category { get; set; }

        public decimal Amount { get; set; }

        public string Date { get; set; }
        public bool IsComplete { get; set; } = false;
        public bool isValid { get; set; } = false;
        public Item() { }
    }
}
