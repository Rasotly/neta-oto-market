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
        public bool InStock { get; set; }
    }
}