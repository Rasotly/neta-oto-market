namespace NetaOtoMarket.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }        // Yeni: Fiyat
        public string Description { get; set; }   // Yeni: Açıklama
        public string ImageUrl { get; set; }      // Yeni: Görsel Linki
        public List<string>? ImageUrls { get; set; } = new List<string>(); // Çoklu Görsel
        public string? Brand { get; set; }        // Marka
        public string? Model { get; set; }        // Model
        public int StockCount { get; set; }       // Stok Adedi
        public bool InStock { get; set; }
    }
}