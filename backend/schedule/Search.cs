namespace capstone {
    public class Search
    {
        public int Year { get; set; }
        public int Day { get; set; }
        public int? StartTime { get; set; }
        public int? EndTime { get; set; }
        public List<string> Coaches { get; set; } = new();
        public List<string> Courses { get; set; } = new();
    }
}