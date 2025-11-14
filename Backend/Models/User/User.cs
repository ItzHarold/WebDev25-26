namespace Backend.Models.User;

public class User
{
    public int Id { get; set; }  
    
    public string Role { get; set; }
    
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public string UserName { get; set; }
    
    public string Email { get; set; }
    
    public string Password { get; set; }
    
    public DateTime DOB { get; set; }
    
    public int Team { get; set; }
    
    public int Favourite { get; set; }
    
    public string ImageUrl { get; set; }
    
}