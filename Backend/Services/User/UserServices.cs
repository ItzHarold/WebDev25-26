using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Backend.Models.User;

    public interface IUserService
    {
        IEnumerable<User> GetAllUsers();
        User? GetUserById(int id);
        void AddUser(User user);
        void UpdateUser(User user);
        void DeleteUser(int id);
    }

    public class UserService : IUserService
    {
        private readonly List<User> _users = new();

        public IEnumerable<User> GetAllUsers()
        {
            return _users;
        }

        public User? GetUserById(int id)
        {
            return _users.FirstOrDefault(c => c.Id == id);
        }

        public void AddUser(User user)
        {
            user.Id = _users.Count > 0 ? _users.Max(c => c.Id) + 1 : 1;
            _users.Add(user);
        }

        public void UpdateUser(User user)
        {
            var existingUser = GetUserById(user.Id);
            if (existingUser != null)
            {
                var updatedUser = new User
                {
                    Id = existingUser.Id,
                    Role = user.Role,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Password = user.Password,
                    DOB = user.DOB,
                    Team = user.Team,
                    Favourite = user.Favourite,
                    ImageUrl = user.ImageUrl
                };
                _users[_users.IndexOf(existingUser)] = updatedUser;
            }
        }

        public void DeleteUser(int id)
        {
            var user = GetUserById(id);
            if (user != null)
            {
                _users.Remove(user);
            }
        }
    }