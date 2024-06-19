namespace TheNumberGame.Models.entity
{
    public class Player
    {
        public int Id { get; set; }
        public String Name { get; set; }
        public int Number { get; set; }
        public int Order { get; set; }

        public Player(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public Player(int id, string name, int number) : this(id, name)
        {
            Number = number;
        }

        public Player(int id, string name, int number, int order) : this(id, name, number)
        {
            Order = order;
        }

        public Player()
        {
        }

        public Player [] generatePlayer(int nbPlayer)
        {
            List<Player> result = new List<Player>();
            for(int i = 0; i < nbPlayer; i++)
            {
                int id = i + 1;
                result.Add(new Player(id, "Player" + id));
            }
            return result.ToArray();
        }

        public Player[] jsonToPlayer(String jsonData)
        {
            string[] listReponse = jsonData.Split('&');
            List<Player> result = new List<Player>();
            for (int i = 0; i < listReponse.Length; i++)
            {
                string[] info = listReponse[i].Split("_");
                int id = Int32.Parse(info[0]);
                int number = Int32.Parse(info[1]);
                result.Add(new Player(id, "Player " + id, number , i+1));
            }
            return result.ToArray();
        }

    }
}
