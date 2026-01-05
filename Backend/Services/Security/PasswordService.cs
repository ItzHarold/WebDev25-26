using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

/// <summary>
/// Interface defining operations for password hashing and verification.
/// </summary>
public interface IPasswordService
{
    /// <summary>
    /// Hashes a plain text password for secure storage.
    /// </summary>
    /// <param name="password">The plain text password to hash</param>
    /// <returns>The hashed password string</returns>
    string Hash(string password);

    /// <summary>
    /// Verifies a plain text password against a stored hash.
    /// </summary>
    /// <param name="hashedPassword">The stored hashed password</param>
    /// <param name="inputPassword">The plain text password to verify</param>
    /// <returns>True if the password matches, false otherwise</returns>
    bool Verify(string hashedPassword, string inputPassword);
}

/// <summary>
/// Service responsible for secure password hashing and verification.
/// Uses ASP.NET Core Identity's PasswordHasher for industry-standard security.
/// </summary>
/// <remarks>
/// This service implements the IPasswordService interface to provide
/// secure password hashing using the PBKDF2 algorithm with HMAC-SHA256,
/// which is the default for ASP.NET Core Identity's PasswordHasher.
/// </remarks>
public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<string> _hasher = new();

    /// <summary>
    /// Hashes a plain text password using PBKDF2 with HMAC-SHA256.
    /// The hash includes a random salt for additional security.
    /// </summary>
    /// <param name="password">The plain text password to hash</param>
    /// <returns>A base64-encoded hash string containing the salt and hashed password</returns>
    public string Hash(string password)
    {
        return _hasher.HashPassword(null!, password);
    }

    /// <summary>
    /// Verifies a plain text password against a stored hash.
    /// Extracts the salt from the hash and computes a hash of the input
    /// to compare against the stored value.
    /// </summary>
    /// <param name="hashedPassword">The stored hashed password from the database</param>
    /// <param name="inputPassword">The plain text password provided by the user</param>
    /// <returns>True if the passwords match, false otherwise</returns>
    public bool Verify(string hashedPassword, string inputPassword)
    {
        var result = _hasher.VerifyHashedPassword(null!, hashedPassword, inputPassword);
        return result == PasswordVerificationResult.Success;
    }
}