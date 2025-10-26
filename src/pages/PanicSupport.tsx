import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Heart, Phone, MessageCircle } from 'lucide-react';

const PanicSupport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showWhy, setShowWhy] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const breathingCycle = [
    { phase: 'inhale', duration: 4000, text: 'Breathe in...' },
    { phase: 'hold', duration: 2000, text: 'Hold...' },
    { phase: 'exhale', duration: 6000, text: 'Breathe out...' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathing && breathCount < 5) {
      let cycleIndex = 0;
      let phaseStart = Date.now();
      
      const updateBreathing = () => {
        const now = Date.now();
        const elapsed = now - phaseStart;
        const currentPhase = breathingCycle[cycleIndex];
        
        if (elapsed >= currentPhase.duration) {
          cycleIndex = (cycleIndex + 1) % breathingCycle.length;
          phaseStart = now;
          
          if (cycleIndex === 0) {
            setBreathCount(prev => prev + 1);
          }
        }
        
        setBreathPhase(currentPhase.phase as any);
        
        if (breathCount < 5) {
          interval = setTimeout(updateBreathing, 100);
        } else {
          setIsBreathing(false);
        }
      };
      
      updateBreathing();
    }
    
    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isBreathing, breathCount]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
  };

  const resetBreathing = () => {
    setIsBreathing(false);
    setBreathCount(0);
    setBreathPhase('inhale');
  };

  const getCircleScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 0.8;
      default: return 1;
    }
  };

  const getCircleColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-green-400 to-green-600';
      case 'exhale': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">I'm here with you</h1>
          <p className="text-gray-600 text-lg">You're safe. This will pass. Let's breathe together.</p>
        </motion.div>

        {/* Breathing Exercise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{
                scale: getCircleScale(),
                backgroundColor: breathPhase === 'inhale' ? '#3B82F6' : 
                                breathPhase === 'hold' ? '#10B981' : '#8B5CF6'
              }}
              transition={{ duration: 0.5 }}
              className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getCircleColor()} flex items-center justify-center shadow-2xl`}
            >
              <div className="text-white text-center">
                <div className="text-6xl mb-2">🫁</div>
                <div className="text-lg font-semibold">
                  {breathingCycle.find(phase => phase.phase === breathPhase)?.text || 'Ready to breathe'}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Breaths completed: {breathCount}/5
            </p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-3 h-3 rounded-full ${
                    num <= breathCount ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {breathCount < 5 ? (
            <motion.button
              onClick={isBreathing ? resetBreathing : startBreathing}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                isBreathing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'btn-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isBreathing ? 'Stop Breathing' : 'Start Breathing Exercise'}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-green-600 text-xl font-semibold mb-4">
                🎉 Great job! You've completed 5 breaths.
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowWhy(true)}
                  className="w-full btn-secondary"
                >
                  Remember My Why
                </button>
                <button
                  onClick={() => setShowResources(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                >
                  Call Emergency Contact
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                >
                  I'm Feeling Better
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Crisis Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Crisis Hotlines:</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">988</p>
                  <p className="text-sm text-blue-600">Suicide & Crisis Lifeline (US)</p>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Call
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">+1-800-273-8255</p>
                  <p className="text-sm text-blue-600">24/7 Support</p>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Call
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">Crisis Text Line</p>
                  <p className="text-sm text-blue-600">Text HOME to 741741</p>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Text
              </button>
            </div>
          </div>
        </motion.div>

        {/* Your Why Modal */}
        <AnimatePresence>
          {showWhy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💝</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Why</h2>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <p className="text-amber-800 leading-relaxed">
                      "{user?.whyStatement || 'I want to overcome my fear of rejection because I deserve meaningful connections'}"
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWhy(false)}
                    className="mt-6 btn-primary"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Modal */}
        <AnimatePresence>
          {showResources && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Emergency Contacts</h2>
                  <p className="text-gray-600 mb-6">
                    You're not alone. These resources are available 24/7:
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                      Call 988 (Suicide & Crisis Lifeline)
                    </button>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                      Call Emergency Contact
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                      Crisis Text Line
                    </button>
                    <button
                      onClick={() => setShowResources(false)}
                      className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PanicSupport;

