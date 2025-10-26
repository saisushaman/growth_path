import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Target, Users, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIService } from '../services/AIService';

interface BehaviorInsight {
  id: string;
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  actionable: string;
  data: any;
}

const BehaviorAnalysis: React.FC = () => {
  const { user, habits, checkIns, screenTime, posts } = useUser();
  const [insights, setInsights] = useState<BehaviorInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyzeBehavior();
  }, [user, habits, checkIns, screenTime]);

  const analyzeBehavior = async () => {
    setLoading(true);
    
    try {
      const analysisData = {
        habits: habits,
        checkIns: checkIns.slice(0, 7), // Last 7 days
        screenTime: screenTime,
        goals: user?.goals || [],
        lifestyle: user?.lifestyle,
        points: user?.rewardPoints || 0,
        streak: user?.streak || 0,
        completedTasks: user?.microTasksCompletedToday || 0
      };

      const newInsights: BehaviorInsight[] = [];

      // 1. Habit Analysis
      const habitCompletionRate = habits.filter(h => h.completed).length / Math.max(habits.length, 1);
      if (habitCompletionRate > 0.8) {
        newInsights.push({
          id: 'habit_1',
          type: 'positive',
          title: '🔥 Amazing Habit Streak!',
          description: `You're completing ${Math.round(habitCompletionRate * 100)}% of your habits. Keep it up!`,
          actionable: 'Your consistency is building powerful new neural pathways. This is transformational!',
          data: { completionRate: habitCompletionRate }
        });
      } else if (habitCompletionRate < 0.5) {
        newInsights.push({
          id: 'habit_2',
          type: 'warning',
          title: '⚠️ Habit Consistency Needs Attention',
          description: `Only ${Math.round(habitCompletionRate * 100)}% of habits completed. Let's refocus.`,
          actionable: 'Start with ONE easy habit. Stack it with something you already do. Example: After coffee, do 2 pushups.',
          data: { completionRate: habitCompletionRate }
        });
      }

      // 2. Check-in Mood Analysis
      if (checkIns.length > 0) {
        const recentMoods = checkIns.slice(-7).map(ci => ci.mood);
        const moodFrequency: Record<string, number> = {};
        recentMoods.forEach(mood => {
          if (mood) {
            moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
          }
        });
        
        const mostCommonMood = Object.keys(moodFrequency).reduce((a, b) => 
          (moodFrequency[a] || 0) > (moodFrequency[b] || 0) ? a : b
        );

        if (mostCommonMood === 'anxious' || mostCommonMood === 'stressed') {
          newInsights.push({
            id: 'mood_1',
            type: 'warning',
            title: '😔 Increased Stress Detected',
            description: 'Your check-ins show elevated stress levels this week.',
            actionable: 'Schedule 3 breathing breaks (5 min each) today. Use 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.',
            data: { mood: mostCommonMood }
          });
        } else if (mostCommonMood === 'accomplished' || mostCommonMood === 'happy') {
          newInsights.push({
            id: 'mood_2',
            type: 'positive',
            title: '😊 Positive Momentum!',
            description: 'You\'ve been feeling accomplished lately. This is great progress!',
            actionable: 'Capitalize on this positive energy. Try something slightly outside your comfort zone while confidence is high.',
            data: { mood: mostCommonMood }
          });
        }
      }

      // 3. Screen Time Analysis
      const totalScreenTime = screenTime.reduce((sum, app) => sum + app.usage, 0);
      const totalGoal = screenTime.reduce((sum, app) => sum + app.goal, 0);
      
      if (totalScreenTime > totalGoal) {
        newInsights.push({
          id: 'screen_1',
          type: 'warning',
          title: '📱 Screen Time Exceeds Goals',
          description: `You're using ${totalScreenTime}m when goal is ${totalGoal}m`,
          actionable: 'Implement phone-free zones: bathroom, dinner table, first 30 min after waking. Use grayscale mode to reduce appeal.',
          data: { usage: totalScreenTime, goal: totalGoal }
        });
      }

      // 4. Streak Analysis
      if (user?.streak !== undefined) {
        if (user.streak >= 7) {
          newInsights.push({
            id: 'streak_1',
            type: 'positive',
            title: `🔥 ${user.streak} Day Streak!`,
            description: `You've maintained your streak for ${user.streak} days. Momentum is powerful!`,
            actionable: 'Never break the chain! Even a tiny action counts. On tough days, just 2 minutes counts.',
            data: { streak: user.streak }
          });
        } else if (user.streak === 0) {
          newInsights.push({
            id: 'streak_2',
            type: 'suggestion',
            title: '💪 Ready to Start Your Streak?',
            description: 'Every expert was once a beginner. Today can be your Day 1!',
            actionable: 'Start with ONE micro-task today. Build momentum brick by brick.',
            data: { streak: user.streak }
          });
        }
      }

      // 5. Task Completion Analysis
      const tasksCompleted = user?.microTasksCompletedToday || 0;
      if (tasksCompleted === 0) {
        newInsights.push({
          id: 'tasks_1',
          type: 'suggestion',
          title: '🎯 No Micro-tasks Completed Today',
          description: 'Start with just one small action. Momentum builds on itself.',
          actionable: 'Right now: Check off ONE thing on your list, no matter how small.',
          data: { tasks: tasksCompleted }
        });
      } else if (tasksCompleted >= 3) {
        newInsights.push({
          id: 'tasks_2',
          type: 'positive',
          title: `🏆 ${tasksCompleted} Micro-tasks Done!`,
          description: 'You\'re crushing it today! Small actions compound.',
          actionable: 'Keep going! You\'re in the flow state. Add one more task before you stop.',
          data: { tasks: tasksCompleted }
        });
      }

      setInsights(newInsights);
    } catch (error) {
      console.error('Behavior analysis error:', error);
      toast.error('Failed to analyze behavior');
    } finally {
      setLoading(false);
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'from-green-500 to-emerald-500';
      case 'warning': return 'from-orange-500 to-red-500';
      case 'suggestion': return 'from-blue-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-6 h-6" />;
      case 'warning': return <AlertCircle className="w-6 h-6" />;
      case 'suggestion': return <Sparkles className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Analyzing your behavior...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Behavior Analysis</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={analyzeBehavior}
          className="text-sm text-purple-600 hover:text-purple-800 font-semibold"
        >
          Refresh Analysis
        </motion.button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Complete more activities to generate insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${getInsightColor(insight.type)} text-white rounded-xl p-5 shadow-lg`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2">{insight.title}</h4>
                  <p className="text-sm opacity-95 mb-3">{insight.description}</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-3">
                    <p className="text-sm font-semibold">💡 Action:</p>
                    <p className="text-sm">{insight.actionable}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Data Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{habits.length}</div>
            <div className="text-xs text-gray-600">Habits</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{user?.streak || 0}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{checkIns.length}</div>
            <div className="text-xs text-gray-600">Check-ins</div>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">{user?.microTasksCompletedToday || 0}</div>
            <div className="text-xs text-gray-600">Tasks Today</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BehaviorAnalysis;
