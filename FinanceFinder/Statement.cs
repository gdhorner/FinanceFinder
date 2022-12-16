using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FinanceFinder
{
    internal class Statement
    {
        public string Name { set; get; }

        public string Period { set; get; }

        public decimal GrocerySum { set; get; }

        public decimal FunSum { set; get; }

        public decimal GasSum { set; get; }

        public decimal RestaurantSum { set; get; }

        public decimal AmazonSum { set; get; }
        public decimal OtherSum { set; get; }
        public Stack<Item> Items = new Stack<Item>();

        public Statement() { }

    }
    
}
