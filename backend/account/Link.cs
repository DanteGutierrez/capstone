namespace capstone {
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    public class Link {
        [BsonElement("URL")]
        public string URL { get; set; } = "";
        [BsonElement("ImageURL")]
        public string ImageURL { get; set; } = "";
        [BsonElement("Title")]
        public string Title { get; set; } = "";
        
    }
}