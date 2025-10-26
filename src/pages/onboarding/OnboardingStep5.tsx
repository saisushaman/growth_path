import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useUser } from '../../contexts/UserContext';
import { Sun, Coffee, Moon } from 'lucide-react';

const OnboardingStep5: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Load all onboarding data and create user profile
    const step1 = JSON.parse(localStorage.getItem('onboarding_step1') || '{}');
    const step2 = JSON.parse(localStorage.getItem('onboarding_step2') || '{}');
    const step3 = JSON.parse(localStorage.getItem('onboarding_step3') || '{}');
    const step4 = JSON.parse(localStorage.getItem('onboarding_step4') || '{}');

    const userData = {
      name: step1.name || 'Alex',
      age: step1.age || 28,
      goals: step1.goals || ['social', 'habits', 'anxiety'],
      longTermGoals: step2.longTermGoals || 'Become a confident public speaker and build meaningful friendships',
      shortTermGoals: step2.shortTermGoals || 'Have 3 networking conversations and reduce screen time by 30%',
      whyStatement: step2.whyStatement || 'I want to overcome my fear of rejection because I deserve meaningful connections',
      location: {
        city: step3.city || 'New York',
        radius: step3.radius || 25
      },
      lifestyle: {
        wakeTime: step4.wakeTime || '07:00',
        sleepTime: step4.sleepTime || '23:00',
        exerciseFrequency: step4.exerciseFrequency || '3-4',
        stressLevel: step4.stressLevel || 'weekly'
      },
      rewardPoints: 0,
      rank: 47,
      phase: 1,
      day: 1,
      streak: 0
    };

    updateUser(userData);

    // Clear onboarding data
    localStorage.removeItem('onboarding_step1');
    localStorage.removeItem('onboarding_step2');
    localStorage.removeItem('onboarding_step3');
    localStorage.removeItem('onboarding_step4');
  }, [updateUser]);

  const handleStartJourney = () => {
    navigate('/dashboard');
  };

  const routineCards = [
    {
      icon: <Sun className="w-8 h-8 text-amber-600" />,
      title: 'Morning Routine',
      time: '6:30 AM - 7:30 AM',
      color: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      items: [
        'Wake at 6:30',
        'Drink 500ml water',
        '5-min movement',
        '3-min breathing'
      ]
    },
    {
      icon: <Coffee className="w-8 h-8 text-blue-600" />,
      title: 'Daily Anchors',
      time: 'Check-ins: 9 AM, 1 PM, 7 PM',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      items: [
        '9 AM check-in',
        '1 PM check-in',
        'Micro-habit window: 2-3 PM',
        '7 PM check-in'
      ]
    },
    {
      icon: <Moon className="w-8 h-8 text-indigo-600" />,
      title: 'Evening Routine',
      time: '9:30 PM - 10:30 PM',
      color: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      items: [
        'Screen off 9:30',
        '5-min journal',
        'Sleep by 10:30'
      ]
    }
  ];

  return (
    <div className="min-h-screen gradient-bg px-6 py-8 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 5 of 5</span>
            <span className="text-sm text-gray-500">Complete!</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Your Personalized Foundation Plan
          </h1>
          <p className="text-xl text-gray-600">
            Based on your goals and lifestyle, here's your optimized routine
          </p>
        </motion.div>

        {/* Routine Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {routineCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 border ${card.borderColor} shadow-lg`}
            >
              <div className="flex items-center mb-4">
                {card.icon}
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
                  <p className="text-sm text-gray-600">{card.time}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {card.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Why These Times?
              </h3>
              <p className="text-blue-700">
                Based on your schedule, we've optimized for better sleep quality, 
                consistent energy levels, and maximum habit formation success.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Start Journey Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <motion.button
            onClick={handleStartJourney}
            className="btn-primary text-xl px-12 py-4 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start My Journey
          </motion.button>
          <p className="text-gray-500 mt-4">
            Ready to transform your life? Let's begin! 🚀
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStep5;
