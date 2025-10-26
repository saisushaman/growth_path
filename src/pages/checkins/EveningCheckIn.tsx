import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const EveningCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, addCheckIn, addPoints } = useUser();
  const [habitCompleted, setHabitCompleted] = useState<string>('');
  const [bestMoment, setBestMoment] = useState('');
  const [socialQuality, setSocialQuality] = useState<number>(5);
  const [meals, setMeals] = useState<string[]>([]);
  const [challenge, setChallenge] = useState('');
  const [intention, setIntention] = useState('');
  const [recording, setRecording] = useState<string | null>(null);

  const habitOptions = [
    { value: 'done', label: '✓ Done', color: 'bg-green-100 text-green-800' },
    { value: 'partial', label: 'Partial', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'skipped', label: 'Skipped', color: 'bg-red-100 text-red-800' }
  ];

  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' }
  ];

  const handleVoiceInput = (field: string) => {
    setRecording(field);
    
    // More realistic recording duration
    const recordingDuration = Math.random() * 2000 + 3000; // 3-5 seconds
    
    setTimeout(() => {
      const sampleTexts = {
        bestMoment: [
          "Had a great conversation with my colleague during lunch - felt really connected",
          "Successfully presented my ideas in the meeting and got positive feedback",
          "Made eye contact and smiled at someone new today - small win!",
          "Had a meaningful chat with a friend about our goals and dreams"
        ],
        challenge: [
          "Struggled with staying focused during the afternoon meeting",
          "Felt anxious about speaking up in group discussions",
          "Had trouble initiating conversations with new people",
          "Found it hard to maintain energy levels throughout the day"
        ],
        intention: [
          "Tomorrow I want to be more present in conversations and take breaks when I need them",
          "I plan to practice my presentation skills and have at least one meaningful interaction",
          "Tomorrow I'll focus on listening more and asking better questions",
          "I want to be more confident in social situations and less hard on myself"
        ]
      };
      
      const fieldTexts = sampleTexts[field as keyof typeof sampleTexts];
      const randomText = fieldTexts[Math.floor(Math.random() * fieldTexts.length)];
      
      if (field === 'bestMoment') {
        setBestMoment(randomText);
      } else if (field === 'challenge') {
        setChallenge(randomText);
      } else if (field === 'intention') {
        setIntention(randomText);
      }
      
      setRecording(null);
      toast.success('Voice transcribed successfully!');
    }, recordingDuration);
  };

  const handleMealToggle = (meal: string) => {
    setMeals(prev => 
      prev.includes(meal) 
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

  const handleSubmit = () => {
    if (habitCompleted && bestMoment && intention) {
      const checkIn = {
        date: new Date().toISOString().split('T')[0],
        type: 'evening' as const,
        habitCompleted,
        bestMoment,
        socialQuality,
        meals,
        challenge,
        intention
      };

      addCheckIn(checkIn);
      addPoints(30);
      
      toast.success('+30 points! Great reflection!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      navigate('/dashboard');
    }
  };

  const isValid = habitCompleted && bestMoment && intention;

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Let's reflect on your day 🌙
          </h1>
          <p className="text-gray-600">Time to complete: ~3 minutes</p>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Habit Completion */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Complete today's habit?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {habitOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setHabitCompleted(option.value)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    habitCompleted === option.value
                      ? option.color + ' ring-2 ring-offset-2 ring-indigo-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Best Moment */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Best moment?
            </h2>
            <div className="relative">
              <textarea
                value={bestMoment}
                onChange={(e) => setBestMoment(e.target.value)}
                placeholder="What was the highlight of your day?"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={() => handleVoiceInput('bestMoment')}
                disabled={recording === 'bestMoment'}
                className={`absolute right-3 bottom-3 voice-button ${recording === 'bestMoment' ? 'recording' : ''}`}
              >
                {recording === 'bestMoment' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {recording === 'bestMoment' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Recording...
              </motion.div>
            )}
          </div>

          {/* Social Quality */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Social interaction quality?
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Poor</span>
                <span className="text-lg font-semibold text-indigo-600">{socialQuality}/10</span>
                <span className="text-sm text-gray-600">Excellent</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={socialQuality}
                onChange={(e) => setSocialQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${socialQuality * 10}%, #e5e7eb ${socialQuality * 10}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>

          {/* Meals */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What did you eat?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mealOptions.map((meal) => (
                <motion.label
                  key={meal.value}
                  className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    meals.includes(meal.value)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={meals.includes(meal.value)}
                    onChange={() => handleMealToggle(meal.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      meals.includes(meal.value)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {meals.includes(meal.value) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-800">{meal.label}</span>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Challenge */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Biggest challenge?
            </h2>
            <div className="relative">
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What was the most difficult part of your day?"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={() => handleVoiceInput('challenge')}
                disabled={recording === 'challenge'}
                className={`absolute right-3 bottom-3 voice-button ${recording === 'challenge' ? 'recording' : ''}`}
              >
                {recording === 'challenge' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {recording === 'challenge' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Recording...
              </motion.div>
            )}
          </div>

          {/* Tomorrow's Intention */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tomorrow's intention?
            </h2>
            <input
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What do you want to focus on tomorrow?"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              isValid
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
          >
            Complete Evening Check-in
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default EveningCheckIn;
