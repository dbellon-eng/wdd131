// I added a milestone reward system. When the user reaches 1,000 total points,the program displays a celebratory milestone message and automatically awards
// an extra 100 bonus points to motivate the user.

namespace EternalQuest
{
    class Program
    {
        static void Main(string[] args)
        {
            GoalManager manager = new GoalManager();
            manager.Start();
        }
    }
}