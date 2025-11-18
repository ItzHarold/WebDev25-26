using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public interface IPasswordService
{
    string Hash(string password);
    bool Verify(string hashedPassword, string inputPassword);
}

public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<string> _hasher = new();

    public string Hash(string password)
    {
        return _hasher.HashPassword(null!, password);
    }

    public bool Verify(string hashedPassword, string inputPassword)
    {
        var result = _hasher.VerifyHashedPassword(null!, hashedPassword, inputPassword);
        return result == PasswordVerificationResult.Success;
    }
}