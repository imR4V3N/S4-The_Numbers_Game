using TheNumberGame.Models.entity;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace TheNumberGame.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class GameController : Controller
    {
        [HttpGet]
        public IActionResult Game()
        {
            return View();
        }
        [HttpGet("Game")]
        public ActionResult<IEnumerable<int>> getRandomTable()
        {
            int[] randomTable = new Number().randomTable(100, 7);
            var data = new{ randomTable = randomTable };
            return Ok(data);
        }

        [HttpGet("NumberResult")]
        public ActionResult<int> getNumberResult()
        {
            int randomNumber = new Number().randomNumber(1000);
            var data = new { randomNumber = randomNumber };
            return Ok(data);
        }

        [HttpGet("StartGame/{playerNumber}")]
        public ActionResult<IEnumerable<Player>> generatePlayer(int playerNumber)
        {
            Player[] list = new Player().generatePlayer(playerNumber);
            var data = new { players = list };
            return Ok(data);
        }

        // Get sort player list 
        [HttpGet("GetPlayer/{jsonData}/{number}")]
        public ActionResult<IEnumerable<Player>> getPlayer(string jsonData,int number)
        {
            Player[] listPlayer = new Player().jsonToPlayer(jsonData);
            Player[] list = new Number().getPlayersWinners(listPlayer,number); 
            var data = new { players = list };
            return Ok(data);
        }

        // Verify Combination
        [HttpGet("verifCombinaison")]
        public ActionResult<int> verifyCombination(string combinaison, string listNumber)
        {
            Number number = new Number();
            int[] list_chiffre = JsonConvert.DeserializeObject<int[]>(listNumber);
            bool rep = number.verifyCombination(combinaison, list_chiffre);
            int valiny = 0;
            // If combination has no problem
            if (!rep)
            {
                valiny = 1;
            }

            var data = new { valiny = valiny };
            return Ok(data);
        }

        // Return combination result
        [HttpGet("getResultCombinaison")]
        public ActionResult<int> getResultCombinaison(string combinaison)
        {
            Number number = new Number();
            int valiny = number.evaluateCombination(combinaison);

            var data = new { valiny = valiny };
            return Ok(data);
        }
    }
}
