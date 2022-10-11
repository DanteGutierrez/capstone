namespace capstone
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    public class Schedule
    {
        [BsonId]
        public ObjectId _id { get; set; }
        [BsonElement("CourseId")]
        public string? CourseId { get; set; }
        [BsonElement("AccountId")]
        public string? AccountId { get; set; }
        [BsonElement("Year")] 
        public int Year { get; set; }
        [BsonElement("Day")]
        public int Day { get; set; }
        [BsonElement("StartTime")]
        public int StartTime { get; set; }
        [BsonElement("Duration")]
        public int Duration { get; set; }
        public Schedule()
        {
            _id = ObjectId.GenerateNewId();
        }
    }
}