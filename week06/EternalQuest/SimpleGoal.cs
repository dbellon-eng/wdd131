namespace EternalQuest
{
    public class SimpleGoal : Goal
    {
        private bool _isComplete;

        public SimpleGoal(string name, string description, int points) 
            : base(name, description, points)
        {
            _isComplete = false;
        }

        public SimpleGoal(string name, string description, int points, bool isComplete) 
            : base(name, description, points)
        {
            _isComplete = isComplete;
        }

        public override void RecordEvent()
        {
            _isComplete = true;
        }

        public override bool IsComplete() => _isComplete;

        public override string GetDetailsString()
        {
            string status = _isComplete ? "[X]" : "[ ]";
            return $"{status} {GetName()} ({GetDescription()})";
        }

        public override string GetStringRepresentation()
        {
            return $"SimpleGoal:{GetName()},{GetDescription()},{GetPoints()},{_isComplete}";
        }
    }
}