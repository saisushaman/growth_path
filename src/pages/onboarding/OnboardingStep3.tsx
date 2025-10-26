import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';

const OnboardingStep3: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState(25);

  const isValid = city.trim();

  const handleContinue = () => {
    if (isValid) {
      localStorage.setItem('onboarding_step3', JSON.stringify({
        city,
        radius
      }));
      navigate('/onboarding/4');
    }
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 3 of 5</span>
            <span className="text-sm text-gray-500">Find Your Community</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/onboarding/2')}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Community</h1>
          <p className="text-gray-600">Connect with like-minded people nearby</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Location Input */}
          <div className="card">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Your City/Town</h2>
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              🔒 We'll never share your exact location
            </p>
          </div>

          {/* Proximity Radius */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How far to find friends?
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  Within {radius} miles
                </span>
                <span className="text-sm text-gray-500">
                  {radius === 5 ? 'Very close' : radius <= 25 ? 'Nearby' : radius <= 50 ? 'Regional' : 'Wide area'}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${radius}%, #e5e7eb ${radius}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>5 mi</span>
                <span>100 mi</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">
                  Smart Matching
                </h3>
                <p className="text-green-700">
                  We'll connect you with people who share 2+ goals within {radius} miles with 90%+ compatibility
                </p>
              </div>
            </div>
          </motion.div>

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

export default OnboardingStep3;

