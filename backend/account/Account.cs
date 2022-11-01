namespace capstone {
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    public class Account
    {
        [BsonId]
        public ObjectId _id { get; set; }
        [BsonElement("Admin")]
        public bool Admin { get; set; } = false;
        [BsonElement("Email")]
        public string Email { get; set; } = "";
        [BsonElement("Password")]
        public string Password { get; set; } = "";
        [BsonElement("FirstName")]
        public string FirstName { get; set; } = "";
        [BsonElement("LastName")]
        public string LastName { get; set; } = "";
        [BsonElement("PreferredName")]
        public string PreferredName { get; set; } = "";
        [BsonElement("AssignedCourse")]
        public string? AssignedCourse { get; set; }
        [BsonElement("PreferredCourses")]
        public List<string> PreferredCourses { get; set; } = new();
        [BsonElement("ProfilePictureURL")]
        public string ProfilePictureURL { get; set; } = "";
        [BsonElement("Links")]
        public List<Link> Links { get; set; } = new();
        [BsonElement("Status")]
        public string Status { get; set; } = "";
        public Account()
        {
            _id = ObjectId.GenerateNewId();
        }
    }
}