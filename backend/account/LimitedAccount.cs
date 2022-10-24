namespace capstone {
    public class LimitedAccount {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string AssignedCourse { get; set; }
        public List<string> PreferredCourses { get; set; } = new();
        public LimitedAccount(string Id, string email, string name, string assigned, List<string> preferred) {
            this.Id = Id;
            this.Email = email;
            this.Name = name;
            this.AssignedCourse = assigned;
            this.PreferredCourses = preferred;
        }
    }
}