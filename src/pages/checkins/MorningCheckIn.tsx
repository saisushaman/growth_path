import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

const MorningCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, addCheckIn, addPoints } = useUser();
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<string>('');
  const [mainFocus, setMainFocus] = useState('');
  const [socialEvents, setSocialEvents] = useState<boolean | null>(null);
  const [feeling, setFeeling] = useState('');
  const [recording, setRecording] = useState<string | null>(null);

  const sleepEmojis = [
    { value: 1, emoji: '😫', label: 'Terrible' },
    { value: 2, emoji: '😕', label: 'Poor' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' }
  ];

  const energyLevels = [
    { value: 'low', label: 'Low', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-green-100 text-green-800' }
  ];

  const handleVoiceInput = (field: string) => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge for voice input.');
      return;
    }

    setRecording(field);
    
    // Use the Web Speech API for real voice recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('Voice recognition started');
      
      // Auto-stop after 10 seconds if no speech detected
      setTimeout(() => {
        if (recording === field) {
          recognition.stop();
        }
      }, 10000);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input:', transcript);
      
      if (field === 'focus') {
        setMainFocus(transcript);
      } else if (field === 'feeling') {
        setFeeling(transcript);
      }
      
      setRecording(null);
      toast.success('Voice transcribed successfully!');
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle different error types more gracefully
      if (event.error === 'no-speech') {
        // Don't show alert for no-speech, just stop recording
        console.log('No speech detected, stopping recording');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'network') {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert(`Speech recognition error: ${event.error}. Please try again.`);
      }
      
      setRecording(null);
    };
    
    recognition.onend = () => {
      setRecording(null);
    };
    
    recognition.start();
  };

  const handleSubmit = () => {
    if (sleepQuality && energyLevel && mainFocus && socialEvents !== null) {
      const checkIn = {
        date: new Date().toISOString().split('T')[0],
        type: 'morning' as const,
        mood: sleepQuality,
        energy: energyLevel,
        focus: mainFocus,
        socialEvents: socialEvents,
        feeling: feeling
      };

      addCheckIn(checkIn);
      addPoints(30);
      
      toast.success('+30 points! Great start to your day!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });

      navigate('/dashboard');
    }
  };

  const isValid = sleepQuality !== null && energyLevel && mainFocus && socialEvents !== null;

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
            Good morning, {user?.name}! ☀️
          </h1>
          <p className="text-gray-600">Time to complete: ~2 minutes</p>
        </motion.div>

        {/* Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Sleep Quality */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How did you sleep?
            </h2>
            <div className="flex justify-center space-x-4">
              {sleepEmojis.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSleepQuality(option.value)}
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                    sleepQuality === option.value
                      ? 'bg-indigo-100 border-2 border-indigo-500'
                      : 'bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-gray-600">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Energy level?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {energyLevels.map((level) => (
                <motion.button
                  key={level.value}
                  onClick={() => setEnergyLevel(level.value)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    energyLevel === level.value
                      ? level.color + ' ring-2 ring-offset-2 ring-indigo-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {level.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Focus */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Main focus today?
            </h2>
            <div className="relative">
              <textarea
                value={mainFocus}
                onChange={(e) => setMainFocus(e.target.value)}
                placeholder="What's your main focus for today?"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={() => handleVoiceInput('focus')}
                disabled={recording === 'focus'}
                className={`absolute right-3 bottom-3 voice-button ${recording === 'focus' ? 'recording' : ''}`}
              >
                {recording === 'focus' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {recording === 'focus' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Listening...
              </motion.div>
            )}
          </div>

          {/* Social Events */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Social events today?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={() => setSocialEvents(true)}
                className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                  socialEvents === true
                    ? 'bg-green-100 text-green-800 ring-2 ring-offset-2 ring-green-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes
              </motion.button>
              <motion.button
                onClick={() => setSocialEvents(false)}
                className={`py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                  socialEvents === false
                    ? 'bg-red-100 text-red-800 ring-2 ring-offset-2 ring-red-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                No
              </motion.button>
            </div>
          </div>

          {/* Feeling */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How are you feeling?
            </h2>
            <div className="relative">
              <textarea
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Describe your current emotional state..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={() => handleVoiceInput('feeling')}
                disabled={recording === 'feeling'}
                className={`absolute right-3 bottom-3 voice-button ${recording === 'feeling' ? 'recording' : ''}`}
              >
                {recording === 'feeling' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {recording === 'feeling' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Listening...
              </motion.div>
            )}
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
            Complete Morning Check-in
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MorningCheckIn;
