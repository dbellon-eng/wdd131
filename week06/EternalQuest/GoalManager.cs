using System;
using System.Collections.Generic;
using System.IO;

namespace EternalQuest
{
    public class GoalManager
    {
        private List<Goal> _goals = new List<Goal>();
        private int _score = 0;
        private bool _milestoneReached = false;

        public void Start()
        {
            int choice = 0;
            while (choice != 6)
            {
                DisplayPlayerInfo();
                Console.WriteLine("Menu Options:");
                Console.WriteLine("  1. Create New Goal");
                Console.WriteLine("  2. List Goals");
                Console.WriteLine("  3. Save Goals");
                Console.WriteLine("  4. Load Goals");
                Console.WriteLine("  5. Record Event");
                Console.WriteLine("  6. Quit");
                Console.Write("Select a choice from the menu: ");

                if (int.TryParse(Console.ReadLine(), out choice))
                {
                    switch (choice)
                    {
                        case 1: CreateGoal(); break;
                        case 2: ListGoalDetails(); break;
                        case 3: SaveGoals(); break;
                        case 4: LoadGoals(); break;
                        case 5: RecordEvent(); break;
                    }
                }
            }
        }

        public void DisplayPlayerInfo()
        {
            Console.WriteLine($"\nYou have {_score} points.\n");
        }

        public void CreateGoal()
        {
            Console.WriteLine("\nThe types of Goals are:");
            Console.WriteLine("  1. Simple Goal");
            Console.WriteLine("  2. Eternal Goal");
            Console.WriteLine("  3. Checklist Goal");
            Console.Write("Which type of goal would you like to create? ");
            int type = int.Parse(Console.ReadLine());

            Console.Write("What is the name of your goal? ");
            string name = Console.ReadLine();
            Console.Write("What is a short description of it? ");
            string desc = Console.ReadLine();
            Console.Write("What is the amount of points associated with this goal? ");
            int points = int.Parse(Console.ReadLine());

            if (type == 1)
            {
                _goals.Add(new SimpleGoal(name, desc, points));
            }
            else if (type == 2)
            {
                _goals.Add(new EternalGoal(name, desc, points));
            }
            else if (type == 3)
            {
                Console.Write("How many times does this goal need to be accomplished for a bonus? ");
                int target = int.Parse(Console.ReadLine());
                Console.Write("What is the bonus for accomplishing it that many times? ");
                int bonus = int.Parse(Console.ReadLine());

                _goals.Add(new ChecklistGoal(name, desc, points, target, bonus));
            }
        }

        public void ListGoalDetails()
        {
            Console.WriteLine("\nThe goals are:");
            for (int i = 0; i < _goals.Count; i++)
            {
                Console.WriteLine($"{i + 1}. {_goals[i].GetDetailsString()}");
            }
        }

        public void RecordEvent()
        {
            ListGoalDetails();
            Console.Write("Which goal did you accomplish? ");
            int index = int.Parse(Console.ReadLine()) - 1;

            if (index >= 0 && index < _goals.Count)
            {
                Goal selected = _goals[index];

                if (selected.IsComplete())
                {
                    Console.WriteLine("This goal is already completed!");
                    return;
                }

                selected.RecordEvent();
                int earned = selected.GetPoints();

                if (selected is ChecklistGoal checklist && checklist.IsComplete())
                {
                    earned += checklist.GetBonus();
                }

                _score += earned;
                Console.WriteLine($"Congratulations! You have earned {earned} points!");

                CheckMilestone();
            }
        }

        private void CheckMilestone()
        {
            if (_score >= 1000 && !_milestoneReached)
            {
                _milestoneReached = true;
                _score += 100;
                Console.WriteLine("\n**************************************************");
                Console.WriteLine("MILESTONE REACHED! You passed 1,000 points!");
                Console.WriteLine("You earned an EXTRA BONUS of 100 points!");
                Console.WriteLine("**************************************************\n");
            }
        }

        public void SaveGoals()
        {
            Console.Write("What is the filename for the goal file? ");
            string filename = Console.ReadLine();

            using (StreamWriter output = new StreamWriter(filename))
            {
                output.WriteLine(_score);
                foreach (Goal goal in _goals)
                {
                    output.WriteLine(goal.GetStringRepresentation());
                }
            }
        }

        public void LoadGoals()
        {
            Console.Write("What is the filename for the goal file? ");
            string filename = Console.ReadLine();

            if (File.Exists(filename))
            {
                string[] lines = File.ReadAllLines(filename);
                _score = int.Parse(lines[0]);
                _goals.Clear();

                for (int i = 1; i < lines.Length; i++)
                {
                    string[] parts = lines[i].Split(':');
                    string type = parts[0];
                    string[] data = parts[1].Split(',');

                    if (type == "SimpleGoal")
                    {
                        _goals.Add(new SimpleGoal(data[0], data[1], int.Parse(data[2]), bool.Parse(data[3])));
                    }
                    else if (type == "EternalGoal")
                    {
                        _goals.Add(new EternalGoal(data[0], data[1], int.Parse(data[2])));
                    }
                    else if (type == "ChecklistGoal")
                    {
                        _goals.Add(new ChecklistGoal(data[0], data[1], int.Parse(data[2]), int.Parse(data[3]), int.Parse(data[4]), int.Parse(data[5])));
                    }
                }
            }
        }
    }
}