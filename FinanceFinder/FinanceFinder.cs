using System.Text.RegularExpressions;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using System.Collections;
using System.Globalization;

namespace FinanceFinder
{
    public class FinanceFinder
    {
        public static void Main()
        {
            Statement statement = new Statement();
            statement.Items = new Queue<Item>();
            Console.WriteLine("What statement are you inputting?");
            statement.Name = Console.ReadLine().ToLower();

            Console.WriteLine("For what month?");
            statement.Period = Console.ReadLine();

            string pagesContent = ExtractTextFromPDF($"C:\\Users\\Gavin\\Desktop\\{statement.Name}.pdf");
            //Console.WriteLine(pagesContent);

            statement.ProcessStatement(pagesContent, statement);

            foreach(Item item in statement.Items)
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

    }
}