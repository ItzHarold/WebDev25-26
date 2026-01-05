using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Backend.Services.Image
{
    /// <summary>
    /// Interface defining operations for image file management.
    /// </summary>
    public interface IImageService
    {
        /// <summary>
        /// Saves an uploaded image file to the server.
        /// </summary>
        /// <param name="file">The image file to save</param>
        /// <param name="folderName">The folder name within wwwroot to save to</param>
        /// <param name="oldImageUrl">Optional URL of the old image to delete</param>
        /// <returns>The relative URL of the saved image</returns>
        Task<string> SaveImageAsync(IFormFile file, string folderName, string? oldImageUrl = null);

        /// <summary>
        /// Deletes an image file from the server.
        /// </summary>
        /// <param name="imageUrl">The URL of the image to delete</param>
        /// <param name="folderName">The folder name containing the image</param>
        void DeleteImage(string imageUrl, string folderName);
    }

    /// <summary>
    /// Service responsible for handling image uploads and deletions.
    /// Manages profile pictures, team logos, and event images.
    /// </summary>
    /// <remarks>
    /// Images are stored in the wwwroot folder organized by type:
    /// - profile-pictures: User profile images
    /// - team-pictures: Team logos
    /// - event-pictures: Event promotional images
    /// 
    /// Allowed file types: .jpg, .jpeg, .png, .gif
    /// </remarks>
    public class ImageService : IImageService
    {
        /// <summary>
        /// Saves an uploaded image file to the server.
        /// Generates a unique filename using a GUID to prevent conflicts.
        /// Optionally deletes the old image when replacing.
        /// </summary>
        /// <param name="file">The uploaded image file</param>
        /// <param name="folderName">The subfolder within wwwroot (e.g., "profile-pictures")</param>
        /// <param name="oldImageUrl">Optional URL of the previous image to delete when replacing</param>
        /// <returns>The relative URL path to the saved image (e.g., "/profile-pictures/abc123.jpg")</returns>
        /// <exception cref="InvalidOperationException">Thrown when file type is not allowed</exception>
        public async Task<string> SaveImageAsync(IFormFile file, string folderName, string? oldImageUrl = null)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!Array.Exists(allowedExtensions, ext => ext == extension))
                throw new InvalidOperationException("Invalid file type.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/{folderName}");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Delete old image if it exists and isn't a default image
            if (!string.IsNullOrEmpty(oldImageUrl) && !oldImageUrl.Contains("default"))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", oldImageUrl.TrimStart('/').Replace("/", "\\"));
                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }
            }

            return $"/{folderName}/{fileName}";
        }

        /// <summary>
        /// Deletes an image file from the server filesystem.
        /// Skips deletion if the URL is empty or points to a default image.
        /// </summary>
        /// <param name="imageUrl">The relative URL of the image to delete</param>
        /// <param name="folderName">The folder containing the image (unused but kept for interface consistency)</param>
        public void DeleteImage(string imageUrl, string folderName)
        {
            if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("default")) return;
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageUrl.TrimStart('/').Replace("/", "\\"));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
