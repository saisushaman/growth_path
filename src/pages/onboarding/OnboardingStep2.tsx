import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mic, MicOff } from 'lucide-react';

const OnboardingStep2: React.FC = () => {
  const navigate = useNavigate();
  const [longTermGoals, setLongTermGoals] = useState('');
  const [shortTermGoals, setShortTermGoals] = useState('');
  const [whyStatement, setWhyStatement] = useState('');
  const [recording, setRecording] = useState<string | null>(null);

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
      
      if (field === 'longTerm') {
        setLongTermGoals(transcript);
      } else if (field === 'shortTerm') {
        setShortTermGoals(transcript);
      } else if (field === 'why') {
        setWhyStatement(transcript);
      }
      
      setRecording(null);
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

  const isValid = longTermGoals.trim() && shortTermGoals.trim() && whyStatement.trim();

  const handleContinue = () => {
    if (isValid) {
      localStorage.setItem('onboarding_step2', JSON.stringify({
        longTermGoals,
        shortTermGoals,
        whyStatement
      }));
      navigate('/onboarding/3');
    }
  };

  const VoiceButton: React.FC<{ field: string; isRecording: boolean }> = ({ field, isRecording }) => (
    <motion.button
      type="button"
      onClick={() => handleVoiceInput(field)}
      disabled={isRecording}
      className={`voice-button ${isRecording ? 'recording' : ''}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </motion.button>
  );

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step 2 of 5</span>
            <span className="text-sm text-gray-500">Define Your Path</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/onboarding/1')}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Define Your Path</h1>
          <p className="text-gray-600">Tell us about your goals and motivations</p>
        </motion.div>

        {/* Form Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Long-Term Goals */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🏁</span>
              <h2 className="text-xl font-semibold text-purple-800">Long-Term Goals (6-12 months)</h2>
            </div>
            <div className="relative">
              <textarea
                value={longTermGoals}
                onChange={(e) => setLongTermGoals(e.target.value)}
                placeholder="E.g., Land my dream job, become confident public speaker..."
                maxLength={500}
                className="w-full px-4 py-3 pr-12 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <VoiceButton field="longTerm" isRecording={recording === 'longTerm'} />
                <span className="text-sm text-gray-500">{longTermGoals.length}/500</span>
              </div>
            </div>
            {recording === 'longTerm' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Listening... Speak clearly into your microphone
              </motion.div>
            )}
          </div>

          {/* Short-Term Goals */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🎯</span>
              <h2 className="text-xl font-semibold text-blue-800">Short-Term Goals (30-90 days)</h2>
            </div>
            <div className="relative">
              <textarea
                value={shortTermGoals}
                onChange={(e) => setShortTermGoals(e.target.value)}
                placeholder="E.g., Have 3 networking conversations, reduce screen time by 30%..."
                maxLength={500}
                className="w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <VoiceButton field="shortTerm" isRecording={recording === 'shortTerm'} />
                <span className="text-sm text-gray-500">{shortTermGoals.length}/500</span>
              </div>
            </div>
            {recording === 'shortTerm' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Listening... Speak clearly into your microphone
              </motion.div>
            )}
          </div>

          {/* Why Statement */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">❤️</span>
              <h2 className="text-xl font-semibold text-amber-800">Your "Why" Statement</h2>
            </div>
            <p className="text-sm text-amber-700 mb-4">
              Why is this journey important to you? When things get hard, we'll remind you of this.
            </p>
            <div className="relative">
              <textarea
                value={whyStatement}
                onChange={(e) => setWhyStatement(e.target.value)}
                placeholder="E.g., I want to overcome my fear of rejection because I deserve meaningful connections..."
                maxLength={1000}
                className="w-full px-4 py-3 pr-12 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                rows={5}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <VoiceButton field="why" isRecording={recording === 'why'} />
                <span className="text-sm text-gray-500">{whyStatement.length}/1000</span>
              </div>
            </div>
            {recording === 'why' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-600 flex items-center"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Listening... Speak clearly into your microphone
              </motion.div>
            )}
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

export default OnboardingStep2;
