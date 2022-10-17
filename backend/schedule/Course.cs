namespace capstone {
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    public class Course {
        [BsonId]
        public ObjectId _id { get; set; }
        [BsonElement("Name")]
        public string Name { get; set; } = "";
        [BsonElement("Code")]
        public string Code { get; set; } = "";
        public Course()
        {
            _id = ObjectId.GenerateNewId();
        }
    }
}