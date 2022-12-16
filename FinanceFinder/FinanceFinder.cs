using System.Text.RegularExpressions;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using System.Collections;
using Docnet.Core.Models;
using Docnet.Core;
using System.Globalization;
using Org.BouncyCastle.Asn1.X509.Qualified;
using iText.Kernel.Geom;
using static UglyToad.PdfPig.Core.PdfSubpath;

namespace FinanceFinder
{
    public class FinanceFinder
    {
        // BIGTODO: Might be better/easier to just show the entire line, ask for a name and category they'd like (and maintain those).
        // Then display the category as the 2nd to last column in the line right before the amount. So you can still see all the details.
        public static void Main()
        {
            // TODO: Exists to call process statement without the other methods being static. Probably unnecessary.
            FinanceFinder f = new FinanceFinder();
            Statement statement = new Statement();
            statement.Items = new Stack<Item>();
            Console.WriteLine("What statement are you inputting?");
            statement.Name = Console.ReadLine().ToLower();

            Console.WriteLine("For what month?");
            statement.Period = Console.ReadLine();

            string pagesContent = ExtractTextFromPDF($"C:\\Users\\Gavin\\Desktop\\{statement.Name}.pdf");
            //Console.WriteLine(pagesContent);

            // TODO: Can maintain every method being static. However, since they are all related to the statement, it may be better to put them all within the statement class.
            f.ProcessStatement(pagesContent, statement);

            // TODO: Very inefficient-- should probably change to a different data structure.
            foreach(Item item in statement.Items.Reverse())
            {
                Console.WriteLine($"{item.Date}       {item.Name}       {item.Category}       {item.Amount}");
            }

            Console.WriteLine($"Restaurant Sum: {statement.RestaurantSum}");
            Console.WriteLine($"Grocery Sum: {statement.GrocerySum}");
            Console.WriteLine($"Gas Sum: {statement.GasSum}");
            Console.WriteLine($"Fun Sum: {statement.FunSum}");
            Console.WriteLine($"Amazon Sum: {statement.AmazonSum}");
            Console.WriteLine($"Other Sum: {statement.OtherSum}");

        }
        private static string ExtractTextFromPDF(string filePath)
        {
            PdfReader pdfReader = new PdfReader(filePath);
            PdfDocument pdfDoc = new PdfDocument(pdfReader);
            string pagesContent = "";
            for (int page = 1; page <= pdfDoc.GetNumberOfPages(); page++)
            {
                ITextExtractionStrategy strategy = new SimpleTextExtractionStrategy();
                pagesContent += (PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(page), strategy));
            }
            pdfDoc.Close();
            pdfReader.Close();
            return pagesContent;
        }

        // Reads through pdf string content line by line, using the associated statement type to match the correct criteria for varying formats.
        private void ProcessStatement(string pagesContent, Statement statement)
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
                        //MatchAmexCriteria(statement, item, columns, line);
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

        /*
        private void MatchAmexCriteria(Statement statement, Item item, string[] columns, string line)
        {
            Regex rx = new Regex("^\\d{2}\\/\\d{2}(\\/\\d{2})?$");
            if (rx.IsMatch(columns[0]) && columns.Length == 1)
            {
                item.Date = columns[0];
                return;
            }


            Regex rxName = new Regex("^\\D*$");
            if (!String.IsNullOrWhiteSpace(item.Date) && String.IsNullOrWhiteSpace(item.Name) && rxName.IsMatch(columns[0]))
            {
                item.Name = columns[0].ToLower(); ;
                return;
            }

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

            if (item.IsComplete)
            {
                Hashtable categories;
                if (String.IsNullOrWhiteSpace(item.Date) || String.IsNullOrWhiteSpace(item.Name) || item.Amount == 0) { return; }

                if (categories.ContainsKey(item.Name))
                {
                    item.Category = categories[item.Name].ToString();
                }
                else
                {
                    Console.WriteLine($"Category does not exist yet for {item.Name}");
                }

                Console.WriteLine($"{item.Date}           {item.Name}           {item.Category}           {item.Amount}");
                switch (item.Category)
                {
                    case "Amazon":
                        statement.AmazonSum += item.Amount;
                        break;
                    case "Grocery":
                        statement.GrocerySum += item.Amount;
                        break;
                    case "Restaurant":
                        statement.RestaurantSum += item.Amount;
                        break;
                }
            }

            item.Name = null;
            item.Date = null;
            item.Amount = 0;
            item.Category = null;
        }
        */

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
            // TODO: Read in the aliases.txt file to check columns[1] against it and see if there is a better name to assign to this item. 
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
            statement.Items.Push(item);

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

        // TODO: Tune it up and ensure it is returning the correct name.
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