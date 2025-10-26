import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Smartphone, Lightbulb, Clock } from 'lucide-react';

const ScreenTimeAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { user, screenTime } = useUser();

  if (!user) {
    navigate('/');
    return null;
  }

  const getProgressColor = (usage: number, goal: number) => {
    const percentage = (usage / goal) * 100;
    if (percentage <= 100) return 'green';
    if (percentage <= 120) return 'orange';
    return 'red';
  };

  const getProgressWidth = (usage: number, goal: number) => {
    return Math.min((usage / goal) * 100, 150);
  };

  const totalUsage = screenTime.reduce((sum, app) => sum + app.usage, 0);
  const totalGoal = screenTime.reduce((sum, app) => sum + app.goal, 0);
  const overallProgress = Math.round((totalUsage / totalGoal) * 100);

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Screen Time Analysis 📱</h1>
            <p className="text-gray-600">Track your digital wellness</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>

        {/* Overall Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Today's Usage</h2>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Last updated: 2 min ago</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Total Usage</h3>
              <p className="text-2xl font-bold text-blue-600">{totalUsage} min</p>
              <p className="text-sm text-gray-600">vs {totalGoal} min goal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Goal Progress</h3>
              <p className="text-2xl font-bold text-green-600">{overallProgress}%</p>
              <p className="text-sm text-gray-600">of daily limit</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">vs Last Week</h3>
              <p className="text-2xl font-bold text-purple-600">-25%</p>
              <p className="text-sm text-gray-600">improvement</p>
            </div>
          </div>
        </motion.div>

        {/* App Usage Cards */}
        <div className="space-y-6 mb-8">
          {screenTime.map((app, index) => {
            const color = getProgressColor(app.usage, app.goal);
            const progressWidth = getProgressWidth(app.usage, app.goal);
            const percentage = Math.round((app.usage / app.goal) * 100);
            
            return (
              <motion.div
                key={app.app}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      color === 'red' ? 'bg-red-100' : 
                      color === 'orange' ? 'bg-orange-100' : 'bg-green-100'
                    }`}>
                      <span className="text-2xl">
                        {app.app === 'Instagram' ? '📸' : 
                         app.app === 'TikTok' ? '🎵' : 
                         app.app === 'YouTube' ? '📺' : '📱'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{app.app}</h3>
                      <p className="text-sm text-gray-600">{app.usage} min used</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      color === 'red' ? 'text-red-600' : 
                      color === 'orange' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {percentage}%
                    </p>
                    <p className="text-sm text-gray-500">of {app.goal} min goal</p>
                  </div>
                </div>

                <div className="progress-bar bg-gray-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                      color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${progressWidth}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-sm font-medium ${
                    color === 'red' ? 'text-red-600' : 
                    color === 'orange' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {color === 'red' ? 'Over goal' : 
                     color === 'orange' ? 'Near limit' : 'Under goal'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Goal: {app.goal} min
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8"
        >
          <div className="flex items-center mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">AI Suggestions</h2>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Replace Instagram scrolling</h3>
            <p className="text-blue-700 mb-3">
              You scroll most between 8-10 PM. Try this instead:
            </p>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Read for 15 minutes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Call a friend</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Journal about your day</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">The 5-Minute Rule</h4>
            <p className="text-blue-700 text-sm">
              Before opening any app, ask: "What am I looking for?" If you can't answer in 5 seconds, close it.
            </p>
          </div>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Trends</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📉</span>
                <div>
                  <p className="font-medium text-green-800">Instagram usage down 40%</p>
                  <p className="text-sm text-green-600">Great job reducing social media time!</p>
                </div>
              </div>
              <span className="text-green-600 font-bold">-40%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium text-blue-800">Reading time increased</p>
                  <p className="text-sm text-blue-600">You've replaced scrolling with reading!</p>
                </div>
              </div>
              <span className="text-blue-600 font-bold">+25%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">😴</span>
                <div>
                  <p className="font-medium text-purple-800">Better sleep quality</p>
                  <p className="text-sm text-purple-600">Less screen time before bed</p>
                </div>
              </div>
              <span className="text-purple-600 font-bold">+15%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenTimeAnalysis;

