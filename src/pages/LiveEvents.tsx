import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Mic, MicOff, Calendar, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LiveEvent {
  id: string;
  title: string;
  host: string;
  attendees: number;
  duration: number;
  topic: string;
  isLive: boolean;
  startTime?: string;
}

const LiveEvents: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [recording, setRecording] = useState<string | null>(null);

  const liveEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'Breaking Phone Addiction',
      host: 'Sam Rivera',
      attendees: 23,
      duration: 45,
      topic: 'Screen time strategies',
      isLive: true,
      startTime: '6:00 PM'
    },
    {
      id: '2',
      title: 'Public Speaking Practice',
      host: 'Maya Kumar',
      attendees: 8,
      duration: 60,
      topic: 'Overcoming stage fright',
      isLive: false,
      startTime: 'Tomorrow at 6:00 PM'
    },
    {
      id: '3',
      title: 'Morning Accountability',
      host: 'Alex Johnson',
      attendees: 12,
      duration: 30,
      topic: 'Building morning routines',
      isLive: false,
      startTime: 'Today at 8:00 AM'
    }
  ];

  const [createForm, setCreateForm] = useState({
    title: '',
    topic: '',
    date: '',
    time: '',
    duration: 60,
    maxAttendees: 25,
    visibility: 'community'
  });

  const handleVoiceInput = (field: string) => {
    setRecording(field);
    
    // More realistic recording duration
    const recordingDuration = Math.random() * 2000 + 3000; // 3-5 seconds
    
    setTimeout(() => {
      const sampleTexts = {
        title: [
          'Building Confidence Through Small Wins',
          'Overcoming Social Anxiety Together',
          'Morning Routine Mastery',
          'Networking Without Fear',
          'Habit Formation Strategies',
          'Mindfulness and Social Skills'
        ],
        topic: [
          'How to celebrate micro-achievements and build momentum',
          'Practical techniques for managing social anxiety in real situations',
          'Creating sustainable morning routines that stick',
          'Networking strategies that feel authentic and comfortable',
          'The science behind habit formation and how to apply it',
          'Combining mindfulness practices with social confidence building'
        ]
      };
      
      const fieldTexts = sampleTexts[field as keyof typeof sampleTexts];
      const randomText = fieldTexts[Math.floor(Math.random() * fieldTexts.length)];
      
      if (field === 'title') {
        setCreateForm(prev => ({ ...prev, title: randomText }));
      } else if (field === 'topic') {
        setCreateForm(prev => ({ ...prev, topic: randomText }));
      }
      
      setRecording(null);
      toast.success('Voice transcribed successfully!');
    }, recordingDuration);
  };

  const handleCreateEvent = () => {
    if (createForm.title && createForm.topic) {
      toast.success('Event created successfully!');
      setShowCreateForm(false);
      setCreateForm({
        title: '',
        topic: '',
        date: '',
        time: '',
        duration: 60,
        maxAttendees: 25,
        visibility: 'community'
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Live Events 🎥</h1>
            <p className="text-gray-600">Group talks & discussions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {liveEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card ${event.isLive ? 'ring-2 ring-red-200 bg-red-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {event.host.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      {event.isLive && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-600 text-sm font-medium">🔴 LIVE</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Hosted by {event.host}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-3">{event.topic}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} attending</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.duration} min</span>
                  </div>
                  {event.startTime && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.startTime}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                {event.isLive ? (
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-medium transition-colors">
                    Join Live Now
                  </button>
                ) : (
                  <>
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl font-medium transition-colors">
                      Set Reminder
                    </button>
                    <button className="flex-1 btn-secondary">
                      View Details
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Event Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Event</h2>
              
              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What's your event about?"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleVoiceInput('title')}
                      disabled={recording === 'title'}
                      className={`absolute right-3 top-3 voice-button ${recording === 'title' ? 'recording' : ''}`}
                    >
                      {recording === 'title' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Discussion Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discussion Topic
                  </label>
                  <div className="relative">
                    <textarea
                      value={createForm.topic}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="What will you discuss?"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => handleVoiceInput('topic')}
                      disabled={recording === 'topic'}
                      className={`absolute right-3 bottom-3 voice-button ${recording === 'topic' ? 'recording' : ''}`}
                    >
                      {recording === 'topic' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* When */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={createForm.date}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, date: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="time"
                      value={createForm.time}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, time: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Today 6:00 PM (23 people active)
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[30, 60, 90, 120].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setCreateForm(prev => ({ ...prev, duration }))}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          createForm.duration === duration
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {duration}min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attendees: {createForm.maxAttendees}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={createForm.maxAttendees}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'community', label: 'Community-wide (within radius)' },
                      { value: 'friends', label: 'Friends only' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={createForm.visibility === option.value}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, visibility: e.target.value }))}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    📢 Your event will be visible to all community members within 25 mi
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateEvent}
                    disabled={!createForm.title || !createForm.topic}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Event & Go Live
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveEvents;
