import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Users, Trophy, Zap, Calendar, Smartphone, Target, LogOut, Gift, Database, Edit2, Check, X, PieChart, Sparkles } from 'lucide-react';
import TodayGoalsTracking from '../components/TodayGoalsTracking';
import PhoneUsageTracker from '../components/PhoneUsageTracker';
import { initializeMockData } from '../utils/mockData';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, habits, logout, updateUser } = useUser();
  const [showDemoButton, setShowDemoButton] = useState(true);
  const [isEditingWhy, setIsEditingWhy] = useState(false);
  const [tempWhyStatement, setTempWhyStatement] = useState(user?.whyStatement || '');
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0);

  // Track completed goals count from localStorage
  useEffect(() => {
    const count = parseInt(localStorage.getItem('completed_goals_count') || '0');
    setCompletedGoalsCount(count);

    // Listen for storage changes
    const handleStorageChange = () => {
      const newCount = parseInt(localStorage.getItem('completed_goals_count') || '0');
      setCompletedGoalsCount(newCount);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll localStorage for changes (since storage event only fires in other tabs/windows)
    const interval = setInterval(() => {
      const currentCount = parseInt(localStorage.getItem('completed_goals_count') || '0');
      if (currentCount !== completedGoalsCount) {
        setCompletedGoalsCount(currentCount);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [completedGoalsCount]);

  // Check if demo data already exists
  useEffect(() => {
    const hasDemoData = localStorage.getItem('growthpath_hasDemoData');
    setShowDemoButton(!hasDemoData);
  }, []);

  const loadDemoData = () => {
    try {
      initializeMockData();
      localStorage.setItem('growthpath_hasDemoData', 'true');
      toast.success('Demo data loaded! Refresh the page to see it.');
      setShowDemoButton(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to load demo data');
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const completedTasksToday = habits.filter(h => h.completed).length;
  const totalTasks = habits.length || 5;

  const quickActions = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Mentor',
      subtitle: 'Empathetic coaching',
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/ai-chat')
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Leaderboard',
      subtitle: `You're #${user.rank} globally`,
      color: 'from-amber-500 to-orange-600',
      onClick: () => navigate('/leaderboard')
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Live Events',
      subtitle: '3 happening now',
      color: 'from-red-500 to-red-600',
      onClick: () => navigate('/events')
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Screen Time',
      subtitle: '-25% vs last week',
      color: 'from-orange-500 to-orange-600',
      onClick: () => navigate('/screentime')
    }
  ];

  const todaysHabit = habits.find(h => !h.completed) || {
    id: 1,
    description: 'Make eye contact with one person during a conversation',
    completed: false,
    streak: 5,
    category: 'social'
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Your Why - Major Goal */}
        {user.whyStatement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">🎯</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Your Major Goal</h2>
                <p className="text-xl font-bold italic leading-relaxed">
                  "{user.whyStatement}"
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              📍 {user.location?.city || 'Location not set'} • Day {user.day}
            </p>
          </div>
          <div className="flex space-x-3">
          <button
            onClick={() => navigate('/rewards')}
            className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <Gift className="w-4 h-4 mr-2 text-purple-500" />
            Rewards 🎁
          </button>
          <button
            onClick={() => navigate('/community')}
            className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Community 👥
          </button>
            <button
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-200 hover:border-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reward Points</p>
                <p className="text-2xl font-bold text-indigo-600">{user.rewardPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Rank #{user.rank}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fitness</p>
                <p className="text-2xl font-bold text-green-600">45 min</p>
                <p className="text-sm text-gray-500">8,234 steps</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🏃</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{user.streak} days</p>
                <p className="text-sm text-gray-500">Keep it going! 🔥</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">📅</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Competition Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-orange-800 mb-1">
                75% of users completed their habits today!
              </h3>
              <p className="text-orange-700 mb-3">
                You're falling behind. Complete 2 more tasks to catch up.
              </p>
              <div className="progress-bar bg-orange-200">
                <div className="progress-fill bg-gradient-to-r from-orange-500 to-red-500" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <TodayGoalsTracking />
            </motion.div>

            {/* Phone Usage Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <PhoneUsageTracker />
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Why */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-amber-800">Your Why</h3>
                {!isEditingWhy ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsEditingWhy(true);
                      setTempWhyStatement(user?.whyStatement || '');
                    }}
                    className="text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        updateUser({ whyStatement: tempWhyStatement });
                        setIsEditingWhy(false);
                        toast.success('Your Why updated! 💫');
                      }}
                      className="text-green-700 hover:text-green-900"
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setIsEditingWhy(false);
                        setTempWhyStatement(user?.whyStatement || '');
                      }}
                      className="text-red-700 hover:text-red-900"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </div>
              
              {isEditingWhy ? (
                <textarea
                  value={tempWhyStatement}
                  onChange={(e) => setTempWhyStatement(e.target.value)}
                  placeholder="What's your core motivation? Why are you on this journey?"
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-amber-800 text-sm leading-relaxed focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  rows={4}
                  autoFocus
                />
              ) : (
                <p className="text-amber-700 text-sm leading-relaxed">
                  "{user?.whyStatement || 'Add your why statement...'}"
                </p>
              )}
            </motion.div>

            {/* Community Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="card"
            >
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Community Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">AJ</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-1">
                      Alex Johnson shared a win
                    </p>
                    <p className="text-xs text-gray-500">2h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">MK</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-1">
                      Maya Kumar posted a strategy
                    </p>
                    <p className="text-xs text-gray-500">5h ago</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/community')}
                className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                View All Posts →
              </button>
            </motion.div>

            {/* Daily Inspiration & Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.25 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200"
            >
              <h3 className="font-semibold text-lg text-indigo-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                Daily Inspiration
              </h3>
              <div className="bg-white rounded-lg p-4 mb-3 border border-indigo-100">
                <p className="text-sm text-indigo-700 font-medium mb-2">
                  💡 "Consistency beats perfection. Small daily habits compound into extraordinary results."
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-700 font-semibold mb-1">📊 Today's Tip</p>
                <p className="text-xs text-blue-600">
                  Start with just 5 minutes. The hardest part is beginning. Once you start, momentum builds naturally.
                </p>
              </div>
            </motion.div>

            {/* Behavior Analysis Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  <span>Activity Breakdown</span>
                </h3>
                <button
                  onClick={() => navigate('/behavior-analysis')}
                  className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                >
                  View Details
                </button>
              </div>
              
              {/* Simple Pie Chart */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Habits - 40% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="20"
                    strokeDasharray={`${40 * 2 * Math.PI} ${100 * 2 * Math.PI}`}
                    strokeDashoffset="0"
                  />
                  {/* Goals - 30% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${30 * 2 * Math.PI} ${100 * 2 * Math.PI}`}
                    strokeDashoffset={`-${40 * 2 * Math.PI}`}
                  />
                  {/* Micro-tasks - 20% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray={`${20 * 2 * Math.PI} ${100 * 2 * Math.PI}`}
                    strokeDashoffset={`-${70 * 2 * Math.PI}`}
                  />
                  {/* Screen Time - 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ec4899"
                    strokeWidth="20"
                    strokeDasharray={`${10 * 2 * Math.PI} ${100 * 2 * Math.PI}`}
                    strokeDashoffset={`-${90 * 2 * Math.PI}`}
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Habits: {habits.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Goals: {completedGoalsCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600">Micro-tasks: {user?.microTasksCompletedToday || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                  <span className="text-sm text-gray-600">Screen Time: Tracking</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/ai-chat')}
                  className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-4 rounded-xl shadow-lg"
                >
                  <Zap className="w-6 h-6 mb-2" />
                  <p className="font-bold text-sm">AI Mentor</p>
                  <p className="text-xs opacity-90">Empathetic coaching</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/leaderboard')}
                  className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-4 rounded-xl shadow-lg"
                >
                  <Trophy className="w-6 h-6 mb-2" />
                  <p className="font-bold text-sm">Leaderboard</p>
                  <p className="text-xs opacity-90">You're #{user?.rank || 1}</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/events')}
                  className="bg-gradient-to-br from-red-600 to-red-700 text-white p-4 rounded-xl shadow-lg"
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <p className="font-bold text-sm">Live Events</p>
                  <p className="text-xs opacity-90">3 happening now</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/screentime')}
                  className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-4 rounded-xl shadow-lg"
                >
                  <Smartphone className="w-6 h-6 mb-2" />
                  <p className="font-bold text-sm">Screen Time</p>
                  <p className="text-xs opacity-90">Monitor usage</p>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Panic Support Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="fixed bottom-6 right-6"
        >
          <button
            onClick={() => navigate('/panic')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-colors"
          >
            Need Help Now
          </button>
        </motion.div>
      </div>

      {/* Demo Data Button */}
      {showDemoButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDemoData}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold flex items-center space-x-2 hover:shadow-3xl transition-all"
          >
            <Database className="w-5 h-5" />
            <span>Load Demo Data</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
