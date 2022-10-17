namespace capstone {
    public class LoginSuccess {
        public string id { get; set; } = "";
        public string auth { get; set; } = "";
        public bool admin { get; set; } = false;
        public LoginSuccess(string id, string auth, bool admin) {
            this.id = id;
            this.auth = auth;
            this.admin = admin;
        }
    }
}