import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Send, Mic, MicOff, X, Bot, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIService } from '../services/AIService';
import { AI_CONFIG } from '../config/aiConfig';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hey ${user?.name || 'there'}! I'm your AI mentor powered by advanced empathy algorithms. I'm here to really listen. What's on your mind today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self harm', 'hopeless', 'worthless', 'no point'];

  const checkForCrisis = (text: string): boolean => {
    return crisisKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const aiService = AIService.getInstance();
    
    try {
      // Use the unified AI response method with automatic fallback
      const response = await aiService.getAIResponse(userMessage, user, messages);
      return response.text;
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fall back to simulated response
      return aiService.getSimulatedResponse(userMessage, user, messages).text;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Check for crisis keywords
    if (checkForCrisis(inputText)) {
      setShowCrisisModal(true);
      setIsTyping(false);
      return;
    }

    try {
      // Get AI response
      const aiResponse = await generateAIResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing that right now. Could you try rephrasing your message?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    
    // More realistic recording duration
    const recordingDuration = Math.random() * 3000 + 4000; // 4-7 seconds
    
    // Simulate voice recording
    setTimeout(() => {
      const sampleTexts = [
        "I'm feeling overwhelmed with everything I need to do",
        "I had a really tough day at work today",
        "I'm struggling with social anxiety again",
        "I can't seem to stick to my habits",
        "I feel lonely and disconnected from others",
        "I'm having trouble focusing on my goals",
        "I feel like I'm not making progress fast enough",
        "I'm nervous about an upcoming presentation",
        "I want to be more confident in social situations",
        "I'm feeling stuck and don't know what to do next"
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setInputText(randomText);
      setIsRecording(false);
      toast.success('Voice transcribed successfully!');
    }, recordingDuration);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚡ AI Mentor</h1>
            <div className="flex items-center space-x-2">
              <p className="text-purple-100">Empathetic AI • Always here</p>
              <div className="flex items-center space-x-1 text-xs">
                {AI_CONFIG.MISTRAL_API_KEY ? (
                  <>
                    <Zap className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Mistral AI</span>
                  </>
                ) : AI_CONFIG.OPENAI_API_KEY ? (
                  <>
                    <Bot className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400">OpenAI GPT-4</span>
                  </>
                ) : AI_CONFIG.HUGGINGFACE_API_KEY ? (
                  <>
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400">Free AI Models</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">Simulated Mode</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-lg h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-800 border border-purple-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl border border-purple-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-6 flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share anything..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={2}
            />
            <button
              onClick={handleVoiceInput}
              disabled={isRecording}
              className={`absolute right-3 bottom-3 voice-button ${isRecording ? 'recording' : ''}`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && (
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
                  <span className="text-2xl">❤️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  I'm really concerned about what you just shared
                </h2>
                <p className="text-gray-600 mb-6">
                  Your life matters. Please talk to someone now:
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                    Call 988 (Suicide & Crisis Lifeline)
                  </button>
                  <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                    Call Emergency Contact
                  </button>
                  <button className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                    Crisis Text Line
                  </button>
                  <button
                    onClick={() => setShowCrisisModal(false)}
                    className="w-full text-gray-600 py-2 px-6 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    I'm feeling better now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChat;
