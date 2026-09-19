namespace NetaOtoMarket.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? PasswordHash { get; set; }
        
        // OAuth fields
        public string? Provider { get; set; } // "Google", "Facebook" or null for local
        public string? ProviderKey { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
