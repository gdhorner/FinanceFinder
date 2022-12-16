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
        public Queue<Item> Items = new Queue<Item>();

        public Statement() { }

        // Reads through pdf string content line by line, using the associated statement type to match the correct criteria for varying formats.
        public void ProcessStatement(string pagesContent, Statement statement)
        {
            StringReader strReader = new StringReader(pagesContent);
            string line = null;
            Item item = new();

            Console.WriteLine("First, we are going to set the aliases for the names of the items in the statement to ensure they are clear. When prompted, type the name you would like to give to each item.");
            Console.WriteLine("If there are any item names that you don't want to change, just type the same name back to the system.");
            while (true)
            {
                line = strReader.ReadLine();
                if (line == null) { break; }

                // Split the current line up into an array of columns
                string[] columns = line.Split(" ", StringSplitOptions.RemoveEmptyEntries);

                switch (statement.Name)
                {
                    case "amex":
                        MatchAmexCriteria(statement, item, columns, line);
                        continue;
                    case "chase":
                        MatchChaseCriteria(statement, item, columns, line);
                        if (item.IsComplete)
                        {
                            item = new();
                        }
                        continue;
                    default:
                        Console.WriteLine($"Statement Name: {statement.Name} unrecognized.");
                        throw new Exception($"Statement Name: {statement.Name} unrecognized.");
                }
            }
        }

        private void MatchAmexCriteria(Statement statement, Item item, string[] columns, string line)
        {

            // If the first column matches Amex's Date format for the line, then add it to the item and move to the next line.
            Regex rx = new Regex("^\\d{2}\\/\\d{2}(\\/\\d{2})?$");
            if (rx.IsMatch(columns[0]) && columns.Length == 1)
            {
                item.Date = columns[0];
                return;
            }

            // If the next line matches Amex's Name format, then add it to the item and move to the next line.
            Regex rxName = new Regex("^\\D*$");
            if (!String.IsNullOrWhiteSpace(item.Date) && String.IsNullOrWhiteSpace(item.Name) && rxName.IsMatch(columns[0]))
            {
                string nameAlias = GetNameAlias(line, columns[1].ToLower());
                if (String.IsNullOrWhiteSpace(nameAlias))
                {
                    nameAlias = SetNameAlias(columns[1].ToLower(), line);
                }
                item.Name = nameAlias;
                return;
            }

            // If the next line matches Amex's Amount format, then add it to the item and move to the next line.
            Regex rxAmount = new Regex("^-?[$]\\d{0,5}.\\d{2}$");
            if (!String.IsNullOrWhiteSpace(item.Date) && !String.IsNullOrWhiteSpace(item.Name))
            {
                if (rxAmount.IsMatch(columns[0]))
                {

                    NumberStyles style = NumberStyles.Number | NumberStyles.AllowCurrencySymbol;
                    CultureInfo provider = new CultureInfo("en-US");
                    item.Amount = Decimal.Parse(columns[0], style, provider);
                    item.IsComplete = true;
                }
                else
                {
                    return;
                }
            }

            // If the item is complete until this point, get the item category and sum up each category.
            if (item.IsComplete)
            {
                if (String.IsNullOrWhiteSpace(item.Date) || String.IsNullOrWhiteSpace(item.Name) || item.Amount == 0) { return; }

                item.Category = GetCategory(line, item.Name);
                statement.Items.Enqueue(item);

                SumCategories(statement, item);
            }
            item = new();
        }

        private void MatchChaseCriteria(Statement statement, Item item, string[] columns, string line)
        {
            // If the first column does not match Chase's Date format for the line, then move to the next line.
            Regex rx = new Regex("^\\d{2}\\/\\d{2}$");
            if (!rx.IsMatch(columns[0])) { return; }

            // If the last column does not match Chase's Amount format for the line, then move to the next line.
            Regex rxAmount = new Regex("^-?\\d{0,5}.\\d{2}$");
            if (!rxAmount.IsMatch(columns[columns.Length - 1])) { return; }

            // Chase's first column is always the date.
            item.Date = columns[0];

            // Chase's second column is always the name, however it can consist of multiple columns.
            string nameAlias = GetNameAlias(line, columns[1].ToLower());
            if (String.IsNullOrWhiteSpace(nameAlias))
            {
                nameAlias = SetNameAlias(columns[1].ToLower(), line);
            }
            item.Name = nameAlias;

            // Chase's last column is always the amount.
            item.Amount = Decimal.Parse(columns[columns.Length - 1]);

            // This check is a safe way to skip incorrect lines that are passed in that may just be a payment due date, odd formatting, etc.
            if (String.IsNullOrWhiteSpace(item.Date) || String.IsNullOrWhiteSpace(item.Name) || item.Amount == 0) { return; }

            item.Category = GetCategory(line, item.Name);
            item.IsComplete = true;
            statement.Items.Enqueue(item);

            SumCategories(statement, item);
        }

        private void SumCategories(Statement statement, Item item)
        {
            switch (item.Category)
            {
                case "amazon":
                    statement.AmazonSum += item.Amount;
                    break;
                case "grocery":
                    statement.GrocerySum += item.Amount;
                    break;
                case "restaurant":
                    statement.RestaurantSum += item.Amount;
                    break;
                case "fun":
                    statement.FunSum += item.Amount;
                    break;
                case "gas":
                    statement.GasSum += item.Amount;
                    break;
                case "other":
                    statement.OtherSum += item.Amount;
                    break;
            }
        }

        private string GetNameAlias(string line, string name)
        {
            if (File.Exists("aliases.txt"))
            {
                using (StreamReader sr = File.OpenText("aliases.txt"))
                {
                    string s = "";
                    while ((s = sr.ReadLine()) != null)
                    {
                        string[] split = s.Split("%!@#");
                        if (split[0].Equals(name, StringComparison.OrdinalIgnoreCase))
                        {
                            return split[1];
                        }
                    }
                }
            }
            return String.Empty;
        }

        private string SetNameAlias(string name, string line)
        {
            string itemAlias, itemNameAssociation;
            Console.WriteLine($"Here is the full line from your statement for the item named {name}:\n{line}");
            Console.WriteLine($"What would you like to rename {name} to?");
            itemAlias = Console.ReadLine();

            itemNameAssociation = $"{name}%!@#{itemAlias}\n";

            using (StreamWriter sw = File.AppendText("aliases.txt"))
            {
                sw.WriteLine(itemNameAssociation);
            }
            Console.WriteLine($"{name} has been renamed to {itemAlias}.");
            return itemAlias;
        }

        /* 
         * Currently relies on a categories.txt file existing in the project directory. If it exists, it will search the txt file for the item name and return the associated category.
         * If it doesn't exist, it will create the file and allow the user to associate a category to the item name.
         */
        private string GetCategory(string line, string name)
        {
            string category;
            string dir = Directory.GetCurrentDirectory();
            if (File.Exists("categories.txt"))
            {
                using (StreamReader sr = File.OpenText("categories.txt"))
                {
                    string s = "";
                    while ((s = sr.ReadLine()) != null)
                    {
                        string[] split = s.Split("%!@#");
                        if (split[0].Equals(name, StringComparison.OrdinalIgnoreCase))
                        {
                            return split[1];
                        }
                    }
                }
            }

            Console.WriteLine($"Category does not exist for {name}. What category would you like to give to {name}?");
            category = Console.ReadLine();

            // Add the name -> category association to the categories.txt file and return the category.
            string itemCategory = $"{name}%!@#{category}\n";

            using (StreamWriter sw = File.AppendText("categories.txt"))
            {
                sw.WriteLine(itemCategory);
            }
            return category;
        }
    }
    
}
