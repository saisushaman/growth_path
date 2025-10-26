import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const OnboardingStep4: React.FC = () => {
  const navigate = useNavigate();
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [exerciseFrequency, setExerciseFrequency] = useState('');
  const [stressLevel, setStressLevel] = useState('');

  const exerciseOptions = [
    { id: 'never', label: 'Never', emoji: '😴' },
    { id: '1-2', label: '1-2 times/week', emoji: '🚶' },
    { id: '3-4', label: '3-4 times/week', emoji: '🏃' },
    { id: '5+', label: '5+ times/week', emoji: '💪' }
  ];

  const stressOptions = [
    { id: 'daily', label: 'Daily', emoji: '😰' },
    { id: 'weekly', label: 'Weekly', emoji: '😟' },
    { id: 'monthly', label: 'Monthly', emoji: '😐' },
    { id: 'rarely', label: 'Rarely', emoji: '😌' }
  ];

  const isValid = exerciseFrequency && stressLevel;

  const handleContinue = () => {
    if (isValid) {
      localStorage.setItem('onboarding_step4', JSON.stringify({
        wakeTime,
        sleepTime,
        exerciseFrequency,
        stressLevel
      }));
      navigate('/onboarding/5');
    }
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 4 of 5</span>
            <span className="text-sm text-gray-500">Your Current Routine</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '80%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/onboarding/3')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Current Routine</h1>
          <p className="text-gray-600">Help us personalize your experience</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Sleep Schedule */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Sleep Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wake up time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep time
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Exercise Frequency */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How often do you exercise?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {exerciseOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setExerciseFrequency(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    exerciseFrequency === option.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-medium text-gray-800">{option.label}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How often do you feel stressed?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {stressOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setStressLevel(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    stressLevel === option.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-medium text-gray-800">{option.label}</div>
                  </div>
                </motion.button>
              ))}
            </div>
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
              Complete Setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep4;

