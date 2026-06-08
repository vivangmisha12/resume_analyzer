using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeAnalyzer.API.Data;
using ResumeAnalyzer.API.Models;

namespace ResumeAnalyzer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest("User already exists with this email.");
        }

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = dto.Password // basic implementation for testing
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.PasswordHash == dto.Password);
        
        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(new 
        { 
            Token = "mock-jwt-token-for-dev", 
            User = new { user.Id, user.Username, user.Email } 
        });
    }
}

public record RegisterDto(string Username, string Email, string Password);
public record LoginDto(string Email, string Password);
