using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NetaOtoMarket.API.Data;
using NetaOtoMarket.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;

namespace NetaOtoMarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public class SocialLoginRequest
        {
            public string Token { get; set; } = string.Empty;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] SocialLoginRequest request)
        {
            try
            {
                // Validate token by calling Google UserInfo API
                var googleResponse = await _httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.Token}");
                if (!googleResponse.IsSuccessStatusCode)
                {
                    return Unauthorized(new { message = "Geçersiz Google token" });
                }

                var payload = await googleResponse.Content.ReadFromJsonAsync<GoogleUser>();
                if (payload == null || string.IsNullOrEmpty(payload.Email))
                {
                    return Unauthorized(new { message = "Google kullanıcı bilgileri alınamadı." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Email = payload.Email,
                        FirstName = payload.Given_Name ?? "",
                        LastName = payload.Family_Name ?? "",
                        Provider = "Google",
                        ProviderKey = payload.Sub
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var token = GenerateJwtToken(user);
                return Ok(new { token, user });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Geçersiz Google token", error = ex.Message });
            }
        }

        public class GoogleUser
        {
            public string Sub { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Given_Name { get; set; } = string.Empty;
            public string Family_Name { get; set; } = string.Empty;
        }

        [HttpPost("facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] SocialLoginRequest request)
        {
            try
            {
                // Request user info from Facebook using the access token
                var fbResponse = await _httpClient.GetAsync($"https://graph.facebook.com/me?access_token={request.Token}&fields=id,email,first_name,last_name");
                if (!fbResponse.IsSuccessStatusCode)
                {
                    return Unauthorized(new { message = "Geçersiz Facebook token" });
                }

                var fbUser = await fbResponse.Content.ReadFromJsonAsync<FacebookUser>();
                if (fbUser == null || string.IsNullOrEmpty(fbUser.Email))
                {
                    return Unauthorized(new { message = "Facebook kullanıcı bilgileri alınamadı veya e-posta izni verilmedi." });
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == fbUser.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Email = fbUser.Email,
                        FirstName = fbUser.First_Name ?? "",
                        LastName = fbUser.Last_Name ?? "",
                        Provider = "Facebook",
                        ProviderKey = fbUser.Id
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var token = GenerateJwtToken(user);
                return Ok(new { token, user });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Facebook girişi sırasında hata", error = ex.Message });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT_SECRET_KEY"] ?? "super_secret_key_change_in_production"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT_ISSUER"] ?? "NetaOtoMarket",
                audience: _configuration["JWT_AUDIENCE"] ?? "NetaOtoMarketUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class FacebookUser
        {
            public string Id { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string First_Name { get; set; } = string.Empty;
            public string Last_Name { get; set; } = string.Empty;
        }
    }
}
