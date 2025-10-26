import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const OnboardingStep1: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { id: 'social', label: '💬 Improve social confidence', emoji: '💬' },
    { id: 'habits', label: '🎯 Build better habits', emoji: '🎯' },
    { id: 'anxiety', label: '❤️ Manage anxiety/stress', emoji: '❤️' },
    { id: 'procrastination', label: '⏰ Stop procrastinating', emoji: '⏰' },
    { id: 'career', label: '💼 Career development', emoji: '💼' },
    { id: 'friends', label: '🤝 Make new friends', emoji: '🤝' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const isValid = name.trim() && age >= 18 && age <= 99 && selectedGoals.length >= 1;

  const handleContinue = () => {
    if (isValid) {
      // Store basic info in localStorage for now
      localStorage.setItem('onboarding_step1', JSON.stringify({
        name,
        age,
        goals: selectedGoals
      }));
      navigate('/onboarding/2');
    }
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 1 of 5</span>
            <span className="text-sm text-gray-500">Basic Info & Goals</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '20%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              How old are you?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Enter your age"
              min="18"
              max="99"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">Must be 18-99 years old</p>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              What do you want to work on? (Select at least 1)
            </label>
            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => (
                <motion.label
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedGoals.includes(goal.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal.id)}
                    onChange={() => handleGoalToggle(goal.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedGoals.includes(goal.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedGoals.includes(goal.id) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg text-gray-800">{goal.label}</span>
                  </div>
                </motion.label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Continue Button */}
          <motion.button
            disabled={!isValid}
            onClick={handleContinue}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isValid
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-center">
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep1;

