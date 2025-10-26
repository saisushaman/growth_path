import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Target, CheckCircle, Circle, Zap } from 'lucide-react';

const GoalsTracking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    navigate('/');
    return null;
  }

  const longTermMilestones = [
    { id: 1, text: 'Identified career interests', completed: true },
    { id: 2, text: 'Updated resume', completed: true },
    { id: 3, text: 'Had 3 networking conversations', completed: false, progress: 0, total: 3 },
    { id: 4, text: 'Completed public speaking course', completed: false },
    { id: 5, text: 'Built consistent morning routine', completed: false }
  ];

  const shortTermProgress = [
    { id: 1, text: 'Reduced Instagram by 40 min/day', completed: true },
    { id: 2, text: 'Started 2 conversations this week', completed: true },
    { id: 3, text: 'Attend 1 social event', completed: false, inProgress: true },
    { id: 4, text: 'Read 30 minutes daily', completed: false },
    { id: 5, text: 'Practice gratitude journaling', completed: false }
  ];

  const calculateProgress = (milestones: any[]) => {
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const longTermProgress = calculateProgress(longTermMilestones);
  const shortTermProgressPercent = calculateProgress(shortTermProgress);

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Goals</h1>
            <p className="text-gray-600">Track your progress and celebrate wins</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>

        {/* Long-Term Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 mb-8"
        >
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-purple-800">Long-Term Goal (6-12 months)</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Progress</span>
              <span className="text-sm font-bold text-purple-800">{longTermProgress}%</span>
            </div>
            <div className="progress-bar bg-purple-200">
              <div 
                className="progress-fill bg-gradient-to-r from-purple-500 to-purple-600" 
                style={{ width: `${longTermProgress}%` }}
              ></div>
            </div>
          </div>

          <p className="text-purple-700 mb-6 leading-relaxed">
            {user.longTermGoals}
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-purple-800 mb-3">Milestones</h3>
            {longTermMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center space-x-3">
                {milestone.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className={`text-sm ${
                  milestone.completed ? 'text-green-700 line-through' : 'text-gray-700'
                }`}>
                  {milestone.text}
                  {milestone.progress !== undefined && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({milestone.progress}/{milestone.total})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Short-Term Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 mb-8"
        >
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">Short-Term Goal (30-90 days)</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Progress</span>
              <span className="text-sm font-bold text-blue-800">{shortTermProgressPercent}%</span>
            </div>
            <div className="progress-bar bg-blue-200">
              <div 
                className="progress-fill bg-gradient-to-r from-blue-500 to-blue-600" 
                style={{ width: `${shortTermProgressPercent}%` }}
              ></div>
            </div>
          </div>

          <p className="text-blue-700 mb-6 leading-relaxed">
            {user.shortTermGoals}
          </p>

          <div className="space-y-3">
            <h3 className="font-semibold text-blue-800 mb-3">Progress This Week</h3>
            {shortTermProgress.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : item.inProgress ? (
                  <Zap className="w-5 h-5 text-orange-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className={`text-sm ${
                  item.completed ? 'text-green-700 line-through' : 
                  item.inProgress ? 'text-orange-700 font-medium' : 'text-gray-700'
                }`}>
                  {item.text}
                  {item.inProgress && (
                    <span className="ml-2 text-xs text-orange-600">⚡ In Progress</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">This Week's Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Completed</h3>
              <p className="text-2xl font-bold text-green-600">7</p>
              <p className="text-sm text-gray-600">tasks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Streak</h3>
              <p className="text-2xl font-bold text-blue-600">{user.streak}</p>
              <p className="text-sm text-gray-600">days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Points</h3>
              <p className="text-2xl font-bold text-purple-600">{user.rewardPoints}</p>
              <p className="text-sm text-gray-600">earned</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button className="btn-primary px-8 py-3 text-lg">
            Update Goals
          </button>
          <p className="text-gray-500 mt-3 text-sm">
            Review and adjust your goals based on your progress
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsTracking;

