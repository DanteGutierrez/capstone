namespace capstone {
    public class ListAccounts
    {
        public List<string> Accounts { get; set; } = new();
        public ListAccounts(List<string> accounts) {
            this.Accounts = accounts;
        }
    }
}