namespace capstone {
    public class LimitedAccount {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string AssignedCourse { get; set; }
        public List<string> PreferredCourses { get; set; } = new();
        public string ProfilePictureURL { get; set; }
        public List<Link> Links { get; set; } = new();
        public string Status { get; set; }
        public LimitedAccount(string Id, string email, string name, string assigned, List<string> preferred, string profilePictureURL, List<Link> links, string status) {
            this.Id = Id;
            this.Email = email;
            this.Name = name;
            this.AssignedCourse = assigned;
            this.PreferredCourses = preferred;
            this.ProfilePictureURL = profilePictureURL;
            this.Links = links;
            this.Status = status;
        }
    }
}