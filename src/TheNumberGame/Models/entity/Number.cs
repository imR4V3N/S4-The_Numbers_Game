using System.Data;

namespace TheNumberGame.Models.entity
{
    public class Number
    {

        public int randomNumber(int max)
        {
            Random rand = new Random();
            return rand.Next(1, max);
        }

        public int[] randomTable(int max, int length)
        {
            int[] randomTable = new int[length];
            Random rand = new Random();
            for (int i = 0; i < length; i++)
            {
                randomTable[i] = randomNumber(max);
            }
            return randomTable;
        }

        public Player[] sortPlayerProximityNumber(int number, Player[] players)
        {
            Array.Sort(players, (player1, player2) => {
                int diff1 = Math.Abs(player1.Number - number);
                int diff2 = Math.Abs(player2.Number - number);
                return diff1.CompareTo(diff2);
            });
            return players;
        }


        public bool hasCommonNumber(Player[] players,int number)
        {
            HashSet<int> numbers = new HashSet<int>();
            for (int i = 0; i < players.Length; i++)
            {
                if (numbers.Contains(number))
                {
                    return true;
                }
                numbers.Add(players[i].Number);
            }
            return false;
        }

        public Player [] getPlayerHasCommonNumber(Player[] players) {
            List<Player> result = new List<Player>();
            int number = players[0].Number;
            result.Add(players[0]);
            for (int i = 1; i < players.Length; i++)
            {
                if (players[i].Number == number)
                {
                    result.Add(players[i]);
                }
            }
            return result.ToArray();
        }

        public Player[] sortPlayerByOrder(Player[] players)
        {
            Array.Sort(players, (player1, player2) => {
                int diff1 = Math.Abs(player1.Order);
                int diff2 = Math.Abs(player2.Order);
                return diff1.CompareTo(diff2);
            });
            return players;
        }

        public Player[] getPlayersWinners (Player [] listPlayer , int number)
        {
            Player[] list = new Number().sortPlayerProximityNumber(number, listPlayer);
            if (this.hasCommonNumber(list,number))
            {
                list = this.sortPlayerByOrder(this.getPlayerHasCommonNumber(list));
            }
            return list;
        }

        public int evaluateCombination(string combinaison)
        {
            try
            {
                DataTable table = new DataTable();
                var value = table.Compute(combinaison, string.Empty);
                return Convert.ToInt32(value);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error : " + e.Message);
                return Convert.ToInt32(double.NaN);
            }
        }

        public bool addIndex (int [] listNumber ,int number ,HashSet<int> index)
        {
            int result = -1;
            for (int i = 0; i < listNumber.Length; i++)
            {
                if (listNumber[i] == number && !index.Contains(i))
                {
                    index.Add(i);
                    return true;
                }
            }
            return false;
        }

        public bool verifyCombination (string combinaison,int [] listNumber)
        {
            char[] characters = combinaison.ToCharArray();
            string mot = "";
            HashSet<int> index = new HashSet<int>();
            foreach (char c in characters)
            {
                if (char.IsDigit(c))
                {
                    mot +=c;
                }
                else
                {
                    int chiffre = Int32.Parse(mot);
                    // Misy miverina le nombre na tsy ao anaty listNumber
                    if(!this.addIndex(listNumber, chiffre, index))
                    {
                        return true;
                    }
                    mot = "";
                }
            }
            if (int.TryParse(mot, out int result)) {
                int chiffre = Int32.Parse(mot);
                if (!this.addIndex(listNumber, chiffre, index))
                {
                    return true;
                }
                mot = "";
            }
            return false;
        }

        public int [] jsonToInt(String jsonData)
        {
            string[] listReponse = jsonData.Split('_');
            List<int> result = new List<int>();
            for (int i = 0; i < listReponse.Length; i++)
            {
                int number = Int32.Parse(listReponse[i]);
                result.Add(number);
            }
            return result.ToArray();
        }
    }
}
