namespace capstone {
    public class ScheduleOrdered
    {
        public List<Schedule> Assigned { get; set; } = new();
        public List<Schedule> Preferred { get; set; } = new();
        public ScheduleOrdered(List<Schedule> assigned, List<Schedule> preferred) {
            Assigned = assigned;
            Preferred = preferred;
        }
    }  
}