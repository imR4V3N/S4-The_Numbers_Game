namespace DesChiffres.Models.entity
{
    public class Time
    {
        private Timer timer;
        private DateTime endTime;
        private Action<String> callBack;

        public void startCountDown(int minutes, Action<String> callBack)
        {
            this.endTime = DateTime.Now.AddMinutes(minutes);
            this.callBack = callBack;
            this.timer = new Timer(UpdateCountDown, null, 0, 1000);
        }

        private void UpdateCountDown(object state)
        {
            TimeSpan remainingTime = endTime - DateTime.Now;
            if (remainingTime.TotalSeconds <= 0)
            {
                this.timer.Dispose();
                this.callBack("00:00:00");
            }
            else
            {
                string timeString = string.Format("{0:D2} : {1:D2} : {2:D2}", remainingTime.Minutes, remainingTime.Seconds, remainingTime.Milliseconds);
                this.callBack(timeString);
            }
        }
    }
}
