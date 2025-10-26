import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { CheckCircle, Circle, Plus, Target, Sparkles, PieChart } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIService } from '../services/AIService';

interface TodayGoal {
  id: string;
  text: string;
  completed: boolean;
  goalType?: 'habit' | 'project' | 'learning' | 'other';
  timeRequired?: string;
  resources?: string[];
  successCriteria?: string;
  microTasks?: TodayGoal[]; // Sub-goals
  isMainGoal?: boolean;
  parentGoalId?: string; // For micro-tasks to reference parent
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
  number?: number;
}

const TodayGoalsTracking: React.FC = () => {
  const { user, addPoints, completeMicroTask } = useUser();
  const [goals, setGoals] = useState<TodayGoal[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [goalType, setGoalType] = useState<string>('habit');
  const [timeHorizon, setTimeHorizon] = useState<string>('1 Month');
  const [dailyTime, setDailyTime] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<string>('beginner');

  // AI function to generate micro-tasks for a goal with time and due date
  const generateMicroTasksForGoal = async (
    goalText: string,
    goalType: string,
    timeHorizon: string,
    dailyTime: string,
    currentLevel: string,
    goalId: string
  ): Promise<TodayGoal[]> => {
    const aiService = AIService.getInstance();
    const baseGoal = goalText;
    
    // Calculate days from time horizon
    const timeHorizonMap: { [key: string]: number } = {
      '1 Week': 7,
      '2 Weeks': 14,
      '1 Month': 30,
      '3 Months': 90,
      '6 Months': 180
    };
    const totalDays = timeHorizonMap[timeHorizon] || 30;
    
    const prompt = `Create exactly 5 specific, actionable micro-tasks to break down this goal into small steps:

Goal: ${baseGoal}
Type: ${goalType}
Time Horizon: ${timeHorizon}
Daily Time Available: ${dailyTime || 'Not specified'}
Current Level: ${currentLevel}

Requirements:
1. Create EXACTLY 5 micro-tasks
2. Each task should be specific and actionable (5-30 min each)
3. Include estimated time for each
4. Include difficulty level (easy, medium, hard)
5. Spread tasks across days (Day 1, Day 2, Day 3, etc.)

Return format (one task per line):
1. [Task description] - [Time] - Day X - [Difficulty]
2. [Task description] - [Time] - Day Y - [Difficulty]
3. [Task description] - [Time] - Day Z - [Difficulty]
4. [Task description] - [Time] - Day W - [Difficulty]
5. [Task description] - [Time] - Day V - [Difficulty]

Difficulty levels: easy, medium, or hard

Example for "Learn Guitar":
1. Learn basic finger positions - 10 min - Day 1 - easy
2. Master 3 basic chords (C, G, D) - 15 min - Day 2 - medium
3. Practice strumming pattern - 10 min - Day 3 - easy
4. Play a simple song - 20 min - Day 4 - medium
5. Practice chord transitions - 15 min - Day 5 - hard

Return ONLY the numbered list (5 tasks), no explanations or extra text.`;

    // Hardcoded tasks for common goals
    const hardcodedTasks: { [key: string]: TodayGoal[] } = {
      'learn guitar': [
        {
          id: `micro_${Date.now()}_0`,
          text: 'Learn basic chords (C, G, D)',
          completed: false,
          isMainGoal: false,
          parentGoalId: '',
          timeRequired: '15 min',
          difficulty: 'easy' as const,
          number: 1
        },
        {
          id: `micro_${Date.now()}_1`,
          text: 'Practice strumming pattern',
          completed: false,
          isMainGoal: false,
          parentGoalId: '',
          timeRequired: '10 min',
          difficulty: 'easy' as const,
          number: 2
        },
        {
          id: `micro_${Date.now()}_2`,
          text: 'Play your first complete song',
          completed: false,
          isMainGoal: false,
          parentGoalId: '',
          timeRequired: '20 min',
          difficulty: 'medium' as const,
          number: 3
        }
      ]
    };

    // Check for hardcoded tasks
    const goalLower = baseGoal.toLowerCase();
    if (hardcodedTasks[goalLower]) {
      return hardcodedTasks[goalLower].map((task, idx) => ({
        ...task,
        id: `micro_${Date.now()}_${idx}`,
        parentGoalId: goalId
      }));
    }

    try {
      const response = await aiService.getAIResponse(prompt, user, []);
      
      const lines = response.text.split('\n').filter(line => 
        line.trim() && (line.match(/^\d+\./) || line.match(/^[-•]/))
      );
      
      // Parse tasks with time and day info
      const now = Date.now();
      const parsedTasks = lines.slice(0, 5).map((line, index) => {
      const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
      
      // Extract time (e.g., "5 min", "30 min")
      const timeMatch = cleanLine.match(/(- \d+\s*min|min)/gi);
      const time = timeMatch ? timeMatch[0].replace('- ', '').trim() : '15 min';
      
      // Extract day (e.g., "Day 1", "Day 2")
      const dayMatch = cleanLine.match(/day\s*\d+/i);
      const day = dayMatch ? dayMatch[0] : 'Day 1';
      
      // Extract difficulty (e.g., "easy", "medium", "hard")
      const difficultyMatch = cleanLine.match(/-\s*(easy|medium|hard)\s*$/i);
      const difficulty = difficultyMatch ? difficultyMatch[1].toLowerCase() as 'easy' | 'medium' | 'hard' : 'medium';
      
      // Clean task text (remove time, day, and difficulty info)
      const taskText = cleanLine
        .replace(/- \d+\s*min/gi, '')
        .replace(/- \d+\s*hour/gi, '')
        .replace(/day\s*\d+/gi, '')
        .replace(/-\s*(easy|medium|hard)/gi, '')
        .replace(/- $/i, '')
        .trim();
      
      // Calculate deadline (Day 1 = today, Day 2 = tomorrow, etc.)
      const dayNumber = parseInt(day.match(/\d+/)?.[0] || '1');
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + dayNumber - 1);
      
      return {
        id: `micro_${now}_${index}`,
        text: `${taskText}`,
        completed: false,
        isMainGoal: false,
        parentGoalId: `goal_${now}`, // Will be updated by parent
        goalType: goalType as 'habit' | 'project' | 'learning' | 'other',
        timeRequired: time,
        resources: [],
        successCriteria: `${day} • ${time}`,
        difficulty: difficulty,
        number: index + 1
      };
      });

      // Ensure at least 3 tasks are returned
      if (parsedTasks.length < 3) {
        // Add fallback tasks if AI didn't generate enough
        while (parsedTasks.length < 3) {
          parsedTasks.push({
            id: `micro_${now}_${parsedTasks.length}`,
            text: `Micro task ${parsedTasks.length + 1}`,
            completed: false,
            isMainGoal: false,
            parentGoalId: `goal_${now}`,
            goalType: goalType as 'habit' | 'project' | 'learning' | 'other',
            timeRequired: '15 min',
            resources: [],
            successCriteria: 'Day 1 • 15 min',
            difficulty: 'medium' as const,
            number: parsedTasks.length + 1
          });
        }
      }

      return parsedTasks;
    } catch (error) {
      console.error('AI generation failed:', error);
      // Return fallback tasks
      return Array(3).fill(null).map((_, index) => ({
        id: `micro_${Date.now()}_${index}`,
        text: `Micro task ${index + 1}`,
        completed: false,
        isMainGoal: false,
        parentGoalId: goalId,
        goalType: goalType as 'habit' | 'project' | 'learning' | 'other',
        timeRequired: '15 min',
        resources: [],
        successCriteria: 'Day 1 • 15 min',
        difficulty: 'medium' as const,
        number: index + 1
      }));
    }
  };

  // Break down long-term goals into monthly milestones
  const generateMonthlyGoals = () => {
    if (!user?.longTermGoals) return [];

    const longTermGoal = user.longTermGoals.toLowerCase();
    const monthlyMilestones: TodayGoal[] = [];

    // Social anxiety related
    if (longTermGoal.includes('anxiety') || longTermGoal.includes('social')) {
      monthlyMilestones.push({
        id: 'month_1',
        text: 'Attend 1 social event this week',
        completed: false
      });
      monthlyMilestones.push({
        id: 'month_2',
        text: 'Initiate 3 conversations with strangers',
        completed: false
      });
      monthlyMilestones.push({
        id: 'month_3',
        text: 'Practice public speaking 2 times',
        completed: false
      });
    }

    // Habit building related
    if (longTermGoal.includes('habit') || longTermGoal.includes('routine')) {
      monthlyMilestones.push({
        id: 'month_4',
        text: 'Complete 21-day morning routine',
        completed: false
      });
      monthlyMilestones.push({
        id: 'month_5',
        text: 'Track habits daily for a month',
        completed: false
      });
    }

    // Procrastination related
    if (longTermGoal.includes('procrastinate') || longTermGoal.includes('productivity')) {
      monthlyMilestones.push({
        id: 'month_6',
        text: 'Use Pomodoro technique for 1 week',
        completed: false
      });
      monthlyMilestones.push({
        id: 'month_7',
        text: 'Break 5 big tasks into small steps',
        completed: false
      });
    }

    return monthlyMilestones;
  };

  // Set initial goals based on user data
  React.useEffect(() => {
    if (user?.longTermGoals) {
      const derivedGoals = generateMonthlyGoals();
      setGoals(derivedGoals);
    }
  }, [user?.longTermGoals]);

  // Limit to 2 main goals
  const mainGoals = goals.filter(g => g.isMainGoal);
  
  const addGoal = async () => {
    if (!newGoal.trim()) {
      toast.error('Please enter a goal');
      return;
    }
    
    if (mainGoals.length >= 2) {
      toast.error('You can only have 2 main goals. Complete or delete existing goals first.');
      return;
    }
    
    const goalId = `goal_${Date.now()}`;
    
    const newMainGoal: TodayGoal = {
      id: goalId,
      text: newGoal,
      completed: false,
      goalType: goalType as any,
      timeRequired: dailyTime,
      resources: [],
      successCriteria: '',
      isMainGoal: true,
      microTasks: []
    };
    
    // Auto-generate micro-tasks using AI
    toast.loading('Generating micro-tasks with AI...', { id: 'generating' });
    
    try {
      const microTasks = await generateMicroTasksForGoal(newGoal, goalType, timeHorizon, dailyTime, currentLevel, goalId);
      
      setGoals([...goals, newMainGoal, ...microTasks]);
      
      toast.success(`Goal added! AI generated ${microTasks.length} micro-tasks. ✨`, { id: 'generating' });
      
      // Reset form
      setNewGoal('');
      setDailyTime('');
      setGoalType('habit');
      setTimeHorizon('1 Month');
      setCurrentLevel('beginner');
    } catch (error) {
      console.error('Error generating micro-tasks:', error);
      setGoals([...goals, newMainGoal]);
      toast.success('Goal added (without micro-tasks). Click "AI Break Down" to add them.', { id: 'generating' });
      
      // Reset form
      setNewGoal('');
      setDailyTime('');
      setGoalType('habit');
      setTimeHorizon('1 Month');
      setCurrentLevel('beginner');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        if (goal.id === id && !goal.completed) {
          // Check if it's a micro-task (not main goal)
          const isMicroTask = !goal.isMainGoal;
          
          if (isMicroTask) {
            completeMicroTask(); // Increment micro-task counter
            addPoints(50);
            toast.success('Micro-task completed! +50 points');
          } else {
            addPoints(50);
            toast.success('Goal completed! +50 points');
          }
          
          return { ...goal, completed: true };
        }
        return goal;
      });
      
      // Check if all micro-tasks for a main goal are complete
      updatedGoals.forEach(mainGoal => {
        if (mainGoal.isMainGoal && !mainGoal.completed) {
          const microTasks = updatedGoals.filter(g => g.parentGoalId === mainGoal.id);
          if (microTasks.length > 0 && microTasks.every(mt => mt.completed)) {
            // All micro-tasks complete - mark main goal as complete
            const mainGoalIndex = updatedGoals.findIndex(g => g.id === mainGoal.id);
            if (mainGoalIndex >= 0 && !updatedGoals[mainGoalIndex].completed) {
              updatedGoals[mainGoalIndex].completed = true;
              addPoints(200); // Bonus points for completing main goal
              toast.success('🎉 Main goal completed! +200 bonus points!');
              
              // Update localStorage for completed goals count
              const currentCount = parseInt(localStorage.getItem('completed_goals_count') || '0');
              localStorage.setItem('completed_goals_count', (currentCount + 1).toString());
            }
          }
        }
      });
      
      return updatedGoals;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast.success('Goal removed');
  };

  // Break down goal into micro tasks using AI
  const [breakdownLoading, setBreakdownLoading] = useState<string | null>(null);
  
  const breakIntoMicroGoals = async (goal: TodayGoal) => {
    setBreakdownLoading(goal.id);
    
    try {
      const aiService = AIService.getInstance();
      const baseGoal = goal.text.split(' (')[0].split(' |')[0];
      
      // Build context for AI
      const context = `Goal: ${baseGoal}
Type: ${goal.goalType || 'habit'}
Time available: ${goal.timeRequired || 'Not specified'}
Resources: ${goal.resources?.join(', ') || 'Not specified'}
Constraints: ${user?.lifestyle?.stressLevel || 'Not specified'}
Success criteria: ${goal.successCriteria || 'Not specified'}`;
      
      const prompt = `Break this goal into 3-5 specific, actionable micro-tasks that are:
1. Small and achievable (should take 5-30 minutes each)
2. Concrete and measurable
3. Can be completed today or this week
4. Directly related to achieving the main goal

Goal: ${baseGoal}
Context: ${context}

Return ONLY a numbered list of micro-tasks (one per line), no explanations.
Example format:
1. First specific micro-task
2. Second specific micro-task
3. Third specific micro-task`;

      const response = await aiService.getAIResponse(
        prompt,
        user,
        []
      );
      
      // Parse AI response into micro-goals
      const lines = response.text.split('\n').filter(line => 
        line.trim() && (line.match(/^\d+\./) || line.match(/^[-•]/))
      );
      
      const microGoals: TodayGoal[] = lines.slice(0, 5).map((line, index) => ({
        id: `${goal.id}_m${index + 1}`,
        text: line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim(),
        completed: false
      }));
      
      // Mark original goal as broken down
      setGoals(goals.map(g => {
        if (g.id === goal.id) {
          return { ...goal, text: baseGoal + ' 🎯' };
        }
        return g;
      }));
      
      // Add micro-goals
      microGoals.forEach(mg => setGoals(prev => [...prev, mg]));
      toast.success(`AI generated ${microGoals.length} micro-goals! ✨`);
      
    } catch (error) {
      console.error('AI breakdown error:', error);
      toast.error('Failed to generate micro-goals. Please try again.');
    } finally {
      setBreakdownLoading(null);
    }
  };

  const completedMainGoals = goals.filter(g => g.isMainGoal && g.completed).length;
  const totalMainGoals = goals.filter(g => g.isMainGoal).length;
  const completedMicroTasks = goals.filter(g => !g.isMainGoal && g.completed).length;
  const totalMicroTasks = goals.filter(g => !g.isMainGoal).length;
  
  const progress = totalMainGoals > 0 ? (completedMainGoals / totalMainGoals) * 100 : 0;

  // Behavior analysis based on micro-task completion patterns
  const getBehaviorInsights = () => {
    if (totalMicroTasks === 0) return null;
    
    const completionRate = (completedMicroTasks / totalMicroTasks) * 100;
    const mainGoalCompletionRate = totalMainGoals > 0 ? (completedMainGoals / totalMainGoals) * 100 : 0;
    
    let insights = [];
    
    if (completionRate >= 80) {
      insights.push("🎯 Excellent! You're highly consistent with micro-tasks.");
    } else if (completionRate >= 60) {
      insights.push("👍 Good progress! You're building momentum.");
    } else if (completionRate >= 40) {
      insights.push("💪 Keep going! Small steps lead to big changes.");
    } else {
      insights.push("🌱 Start small. Focus on completing just one micro-task today.");
    }
    
    if (mainGoalCompletionRate >= 50) {
      insights.push("🏆 You're successfully breaking down complex goals into manageable steps.");
    }
    
    return insights;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-800">Today's Goals</h3>
        </div>
        <span className="text-sm text-gray-600">
          {completedMainGoals} / {totalMainGoals} main goals done ({completedMicroTasks} micro-tasks)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Behavior Analysis */}
      {getBehaviorInsights() && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Behavior Analysis
          </h4>
          <div className="space-y-1">
            {getBehaviorInsights()?.map((insight, index) => (
              <p key={index} className="text-sm text-blue-700">{insight}</p>
            ))}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            Micro-task completion rate: {totalMicroTasks > 0 ? Math.round((completedMicroTasks / totalMicroTasks) * 100) : 0}%
          </div>
        </div>
      )}

      {/* Enhanced Add Goal Form */}
      <div id="goal-form-section" className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">Add Primary Goal (Auto-splits into Micro-processes)</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="e.g., Improve public speaking, Learn guitar, Get fit..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="habit">Habit</option>
            <option value="project">Project</option>
            <option value="learning">Learning</option>
            <option value="other">Other</option>
          </select>

          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="1 Week">1 Week</option>
            <option value="2 Weeks">2 Weeks</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
          </select>

          <input
            type="text"
            value={dailyTime}
            onChange={(e) => setDailyTime(e.target.value)}
            placeholder="e.g., 30 mins, 1 hour"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (newGoal.trim()) {
                addGoal();
              }
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 inline mr-2" />
            Generate Micro-Goals with AI
          </motion.button>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {/* Main Goals */}
        {goals.filter(g => g.isMainGoal).map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold">{goal.text}</h3>
                    <p className="text-purple-100 text-sm mt-1">
                      {goals.filter(g => !g.isMainGoal && g.parentGoalId === goal.id).length} micro-tasks created
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  ×
                </button>
              </div>
              
              {!goal.completed && (
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark Goal Complete</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {/* Micro-Goals Journey */}
        {goals.filter(g => !g.isMainGoal).length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Your Micro-Goals Journey
            </h4>
            <AnimatePresence>
              {goals.filter(g => !g.isMainGoal).map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-start space-x-4 p-4 rounded-xl mb-3 transition-all border ${
                    goal.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {goal.completed ? (
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        {goal.number || '•'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-lg mb-1 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {goal.text}
                    </div>
                    {goal.successCriteria && (
                      <div className="text-sm text-gray-600 mb-2">
                        {goal.successCriteria}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {goal.timeRequired && (
                        <div className="text-sm text-gray-600 flex items-center">
                          🕐 {goal.timeRequired}
                        </div>
                      )}
                      {goal.difficulty && (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          goal.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          goal.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {goal.difficulty.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {!goal.completed && (
                    <motion.button
                      onClick={() => toggleGoal(goal.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete</span>
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {goals.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const formSection = document.getElementById('goal-form-section');
              formSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full border-2 border-purple-400 bg-white text-purple-600 px-4 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
          >
            Create New Goal
          </motion.button>
        )}

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No goals set for today</p>
            <p className="text-sm">Add goals above to track your progress</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TodayGoalsTracking;
