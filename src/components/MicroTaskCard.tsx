import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Target, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MicroTaskCard: React.FC = () => {
  const { user, completeMicroTask } = useUser();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Generate microtasks based on user's goals
  const generateMicroTasks = () => {
    const baseTasks = [
      {
        id: 1,
        title: "Make eye contact with one person during a conversation",
        instruction: "Focus on maintaining it for 3-5 seconds",
        points: 25,
        impact: "Builds confidence and shows presence in conversations",
        why: "Eye contact creates connection and reduces anxiety by making you feel more engaged"
      },
      {
        id: 2,
        title: "Compliment someone genuinely",
        instruction: "Find something specific you appreciate about them",
        points: 30,
        impact: "Improves social relationships and your own mood",
        why: "Giving compliments opens doors for deeper connections"
      },
      {
        id: 3,
        title: "Start a conversation with a stranger",
        instruction: "Ask about their day or comment on something around you",
        points: 40,
        impact: "Expands your comfort zone and builds social skills",
        why: "Practice makes perfect - each conversation reduces future anxiety"
      },
      {
        id: 4,
        title: "Practice deep breathing for 2 minutes",
        instruction: "Focus on your breath and let go of tension",
        points: 20,
        impact: "Reduces stress and improves emotional regulation",
        why: "Calm breathing signals safety to your brain, reducing anxiety"
      },
      {
        id: 5,
        title: "Write down one thing you're grateful for",
        instruction: "Be specific and reflect on why it matters",
        points: 15,
        impact: "Shifts mindset from scarcity to abundance",
        why: "Gratitude rewires your brain to notice positives, improving well-being"
      }
    ];

    // Generate goal-specific tasks
    const goalTasks: any[] = [];
    
    if (user?.goals) {
      user.goals.forEach((goal, index) => {
        const lowerGoal = goal.toLowerCase();
        
        if (lowerGoal.includes('anxiety') || lowerGoal.includes('social')) {
          goalTasks.push({
            id: baseTasks.length + index + 1,
            title: `Practice one social interaction related to: ${goal}`,
            instruction: "Take a small step toward your social goal today",
            points: 35
          });
        }
        
        if (lowerGoal.includes('confidence') || lowerGoal.includes('public')) {
          goalTasks.push({
            id: baseTasks.length + index + 10,
            title: `Do one thing that challenges your comfort zone`,
            instruction: "Push yourself slightly beyond your usual boundary",
            points: 40
          });
        }
        
        if (lowerGoal.includes('habit') || lowerGoal.includes('routine')) {
          goalTasks.push({
            id: baseTasks.length + index + 20,
            title: `Practice your habit for just 5 minutes`,
            instruction: "Small consistent steps lead to big changes",
            points: 25
          });
        }
        
        if (lowerGoal.includes('network') || lowerGoal.includes('professional')) {
          goalTasks.push({
            id: baseTasks.length + index + 30,
            title: `Reach out to one professional contact`,
            instruction: "Send a message, email, or make a connection",
            points: 35
          });
        }
      });
    }

    // Combine base tasks with goal-specific tasks
    return [...baseTasks, ...goalTasks];
  };

  const microTasks = generateMicroTasks();

  // Get current microtask based on index
  const todayTask = microTasks[currentTaskIndex];

  const handleComplete = () => {
    completeMicroTask();
    toast.success(`🎉 Microtask completed! +${todayTask.points} points earned!`);
    
    // Move to next task (cycling through)
    const nextIndex = (currentTaskIndex + 1) % microTasks.length;
    setCurrentTaskIndex(nextIndex);
    
    // Show coupon notification if earned
    setTimeout(() => {
      if (Math.random() < 0.3) {
        toast.success("🎁 Bonus: You earned a coupon! Check your rewards!", {
          duration: 4000,
        });
      }
    }, 1000);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <Target className="w-6 h-6 text-purple-600 mr-3" />
        <h3 className="text-xl font-bold text-purple-800">Today's Micro-Habit</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-800 font-medium mb-2">{todayTask.title}</p>
        <p className="text-gray-600 text-sm mb-3">{todayTask.instruction}</p>
        
        {/* Impact & Why */}
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <p className="text-sm font-semibold text-purple-800 mb-1">💪 Impact: {todayTask.impact}</p>
          <p className="text-xs text-purple-700">💡 Why: {todayTask.why}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <p>Microtasks completed today: <span className="font-semibold text-purple-600">{user.microTasksCompletedToday}</span></p>
          <p>Total completed: <span className="font-semibold text-purple-600">{user.totalMicroTasksCompleted}</span></p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Mark Complete</span>
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800 text-sm font-medium">
          💡 Tip: Complete microtasks daily to build confidence and earn rewards!
        </p>
      </div>
    </motion.div>
  );
};

export default MicroTaskCard;

