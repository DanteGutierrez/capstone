namespace capstone {
    public class Login {
        public string Email { get; set; }
        public string Password { get; set; }
        public Login(string Email, string Password) {
            this.Email = Email;
            this.Password = Password;
        }
    }
}