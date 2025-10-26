import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhoneUsageData {
  app: string;
  usage: number; // minutes
  goal: number; // minutes
  color: string;
  trend: 'up' | 'down' | 'stable';
}

const PhoneUsageTracker: React.FC = () => {
  const [phoneData, setPhoneData] = useState<PhoneUsageData[]>([
    { app: 'Instagram', usage: 0, goal: 30, color: 'red', trend: 'stable' },
    { app: 'TikTok', usage: 0, goal: 30, color: 'orange', trend: 'stable' },
    { app: 'YouTube', usage: 0, goal: 40, color: 'green', trend: 'stable' },
  ]);

  // Simulate real-time phone usage tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setPhoneData(prev => prev.map(app => ({
        ...app,
        usage: app.usage + Math.floor(Math.random() * 0.5), // Small random increments
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const totalUsage = phoneData.reduce((sum, app) => sum + app.usage, 0);
  const totalGoal = phoneData.reduce((sum, app) => sum + app.goal, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Screen Time Tracking</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{Math.round(totalUsage)}m</div>
          <div className="text-sm text-gray-500">/{totalGoal}m goal</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Daily Usage</span>
          <span className="text-sm font-semibold text-gray-800">
            {Math.round((totalUsage / totalGoal) * 100)}% of goal
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalUsage / totalGoal) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-3 rounded-full ${
              totalUsage > totalGoal ? 'bg-red-500' : 
              totalUsage > totalGoal * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          />
        </div>
      </div>

      {/* Individual Apps */}
      <div className="space-y-3">
        {phoneData.map((app, index) => {
          const percentage = Math.min((app.usage / app.goal) * 100, 100);
          const isOverLimit = app.usage > app.goal;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{app.app}</span>
                  {isOverLimit && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-700'}`}>
                    {Math.round(app.usage)}m / {app.goal}m
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-2 rounded-full ${
                    isOverLimit ? 'bg-red-500' : 
                    percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 Tips to reduce screen time:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Set app-specific limits and reminders</li>
              <li>Use grayscale mode to make phone less appealing</li>
              <li>Keep your phone in another room at night</li>
              <li>Replace phone time with a hobby</li>
            </ul>
          </div>
        </div>
      </div>

      <button 
        onClick={() => toast.success('Screen time monitoring is active!')}
        className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        📱 View Detailed Report
      </button>
    </motion.div>
  );
};

export default PhoneUsageTracker;
