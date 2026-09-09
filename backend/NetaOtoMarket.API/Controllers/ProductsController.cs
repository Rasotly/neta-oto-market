using Microsoft.AspNetCore.Mvc;
using NetaOtoMarket.API.Models;

namespace NetaOtoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly List<Product> Products = new()
    {
        new Product { Id = 1, Name = "CarPlay & Android Auto Multimedya Sistemi (9-10 inç)", Category = "Multimedya", InStock = true },
        new Product { Id = 2, Name = "Orijinal Uyumlu OEM Yan Basamak Seti", Category = "Yan Basamak", InStock = true },
        new Product { Id = 3, Name = "Ön & Arka Tampon Koruma Barları (Paslanmaz)", Category = "Koruma & Difüzör", InStock = true },
        new Product { Id = 4, Name = "LED Işıklı / Çift Çıkış Spor Arka Difüzör", Category = "Koruma & Difüzör", InStock = true },
        new Product { Id = 5, Name = "Komple Aero Bodykit ve Spoiler Paketi", Category = "Bodykit", InStock = true }
    };

    [HttpGet]
    public IActionResult GetProducts([FromQuery] string? search)
    {
        if (string.IsNullOrWhiteSpace(search))
        {
            return Ok(Products);
        }

        var filtered = Products.Where(p =>
            p.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
            p.Category.Contains(search, StringComparison.OrdinalIgnoreCase)
        ).ToList();

        return Ok(filtered);
    }
}