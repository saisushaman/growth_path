import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Mic, MicOff, ThumbsUp, Heart, Zap, MessageCircle, Plus, Target, UserCheck, Radio, Users, Check, X, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  reactions: {
    like: number;
    love: number;
    fire: number;
    comment: number;
  };
  userReactions: string[];
  badges: string[];
  matchScore?: number;
  sharedGoal?: string;
  collaborators?: number;
}

interface CollaborativeGoal {
  id: string;
  goal: string;
  friend: string;
  progress: number;
  deadline: string;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  matchPercentage: number;
  sharedGoals: string[];
  interests: string[];
  status: 'friend' | 'request' | 'pending';
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  matchPercentage: number;
  sharedGoals: string[];
  interests: string[];
  message?: string;
}

const CommunityFeed: React.FC = () => {
  const navigate = useNavigate();
  const { user, posts, addPost, reactToPost } = useUser();
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'live' | 'collaborate' | 'friends'>('all');
  const [recording, setRecording] = useState(false);
  const [newCollaborativeGoal, setNewCollaborativeGoal] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');

  // Mock collaborative goals with friends
  const [collaborativeGoals] = useState<CollaborativeGoal[]>([
    {
      id: '1',
      goal: 'Complete "Atomic Habits" book',
      friend: 'Alex Johnson',
      progress: 65,
      deadline: '5 days left'
    },
    {
      id: '2',
      goal: 'Practice social confidence 3x per week',
      friend: 'Maya Kumar',
      progress: 40,
      deadline: '12 days left'
    }
  ]);

  // Mock friends data
  const [friends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'AJ',
      matchPercentage: 96,
      sharedGoals: ['Complete "Atomic Habits" book', 'Build morning routine'],
      interests: ['Productivity', 'Self-improvement', 'Reading'],
      status: 'friend'
    },
    {
      id: '2',
      name: 'Sam Rivera',
      avatar: 'SR',
      matchPercentage: 89,
      sharedGoals: ['Learn networking', 'Public speaking'],
      interests: ['Networking', 'Communication', 'Business'],
      status: 'friend'
    }
  ]);

  // Mock friend requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      name: 'Maya Kumar',
      avatar: 'MK',
      matchPercentage: 92,
      sharedGoals: ['Social confidence', 'Mindfulness practice'],
      interests: ['Psychology', 'Meditation', 'Social skills'],
      message: 'Hi! I noticed we have similar goals around social confidence. Would love to connect!'
    },
    {
      id: '2',
      name: 'Emma Wilson',
      avatar: 'EW',
      matchPercentage: 94,
      sharedGoals: ['Overcome social anxiety', 'Build confidence'],
      interests: ['Mental health', 'Self-care', 'Personal growth'],
      message: 'Your posts about social anxiety really resonate with me. Let\'s support each other!'
    },
    {
      id: '3',
      name: 'David Chen',
      avatar: 'DC',
      matchPercentage: 87,
      sharedGoals: ['Morning routine', 'Productivity habits'],
      interests: ['Productivity', 'Time management', 'Entrepreneurship'],
      message: 'Love your approach to building habits. Would be great to share strategies!'
    }
  ]);

  // Podcasts data
  const podcasts = [
    {
      id: '1',
      title: 'How to Overcome Social Anxiety',
      speaker: 'Dr. Sarah Chen',
      duration: '25 min',
      description: 'Learn practical strategies to build confidence in social situations',
      listeners: 1240,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: '2',
      title: 'Building Daily Habits That Stick',
      speaker: 'Alex Thompson',
      duration: '18 min',
      description: 'Small changes that lead to big transformations',
      listeners: 890,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: '3',
      title: 'The Power of Networking',
      speaker: 'Emma Rodriguez',
      duration: '32 min',
      description: 'Connect with purpose and build meaningful relationships',
      listeners: 2340,
      color: 'from-pink-500 to-orange-500'
    }
  ];

  // Live sessions data
  const liveSessions = [
    {
      id: '1',
      title: 'Morning Meditation & Mindfulness',
      host: 'Maya Kumar',
      participants: 23,
      status: 'live',
      startTime: '7:00 AM'
    },
    {
      id: '2',
      title: 'Evening Goal Planning Session',
      host: 'Alex Johnson',
      participants: 47,
      status: 'starting soon',
      startTime: '8:00 PM'
    },
    {
      id: '3',
      title: 'Midday Energy Boost',
      host: 'Sam Rivera',
      participants: 15,
      status: 'live',
      startTime: '12:00 PM'
    }
  ];

  const samplePosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Alex Johnson',
      authorAvatar: 'AJ',
      content: 'Collaborating with you to complete "Atomic Habits" book! 📚 Currently at 65% - let\'s finish this together! 💪',
      timestamp: '2h ago',
      reactions: { like: 12, love: 8, fire: 5, comment: 3 },
      userReactions: [],
      badges: ['Friend', '96% Match'],
      sharedGoal: 'Complete "Atomic Habits" book',
      collaborators: 2
    },
    {
      id: '2',
      author: 'Maya Kumar',
      authorAvatar: 'MK',
      content: 'Strategy: Start conversations with "I noticed..." instead of "what do you do?" People open up way more!',
      timestamp: '5h ago',
      reactions: { like: 24, love: 15, fire: 10, comment: 8 },
      userReactions: [],
      badges: ['92% Match']
    },
    {
      id: '3',
      author: 'Sam Rivera',
      authorAvatar: 'SR',
      content: 'Book rec: "Never Eat Alone" - networking doesn\'t have to be scary when you focus on helping others first',
      timestamp: '8h ago',
      reactions: { like: 18, love: 5, fire: 2, comment: 6 },
      userReactions: [],
      badges: ['Friend', '89% Match']
    },
    {
      id: '4',
      author: 'Emma Wilson',
      authorAvatar: 'EW',
      content: 'Small win: Made eye contact with the barista today and had a genuine smile exchange. Baby steps! 💪',
      timestamp: '1d ago',
      reactions: { like: 31, love: 22, fire: 8, comment: 12 },
      userReactions: [],
      badges: ['94% Match']
    }
  ];

  const allPosts = [...posts, ...samplePosts];

  const handleVoiceInput = () => {
    setRecording(true);
    
    // More realistic recording duration
    const recordingDuration = Math.random() * 3000 + 4000; // 4-7 seconds
    
    setTimeout(() => {
      const sampleTexts = [
        "Just had a breakthrough moment in my social anxiety journey - spoke up in a meeting!",
        "Reading 'The Charisma Myth' and it's changing how I think about confidence",
        "Small win: Started a conversation with someone at the coffee shop today",
        "Anyone else struggle with phone addiction? Found this app called Forest that's helping",
        "Grateful for this community - you all inspire me to keep growing",
        "Had my first networking event today and actually enjoyed it!",
        "Book recommendation: 'Atomic Habits' is helping me build better routines",
        "Feeling proud of myself for completing my 7-day streak",
        "Tip: Start conversations with 'I noticed...' instead of 'what do you do?'",
        "Just finished a great podcast about overcoming social anxiety"
      ];
      
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setNewPost(randomText);
      setRecording(false);
      toast.success('Voice transcribed successfully!');
    }, recordingDuration);
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      addPost({
        author: user?.name || 'You',
        authorAvatar: user?.name?.charAt(0) || 'U',
        content: newPost,
        timestamp: 'now',
        reactions: { like: 0, love: 0, fire: 0, comment: 0 },
        userReactions: [],
        badges: []
      });
      setNewPost('');
      toast.success('Post shared successfully!');
    }
  };

  const handleReaction = (postId: string, reaction: string) => {
    reactToPost(postId, reaction);
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success(`You're now friends with ${request.name}!`);
    }
  };

  const handleRejectFriendRequest = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success(`Friend request from ${request.name} ignored`);
    }
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case 'like': return <ThumbsUp className="w-4 h-4" />;
      case 'love': return <Heart className="w-4 h-4" />;
      case 'fire': return <Zap className="w-4 h-4" />;
      case 'comment': return <MessageCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getReactionColor = (reaction: string, isActive: boolean) => {
    const colors = {
      like: isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:text-blue-600',
      love: isActive ? 'text-red-600 bg-red-100' : 'text-gray-500 hover:text-red-600',
      fire: isActive ? 'text-orange-600 bg-orange-100' : 'text-gray-500 hover:text-orange-600',
      comment: isActive ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:text-green-600'
    };
    return colors[reaction as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community 👥</h1>
            <p className="text-gray-600">15 members • {user?.location?.city || 'Global'}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'all', label: 'All Posts' },
            { id: 'friends', label: '👥 Friends' },
            { id: 'collaborate', label: '🎯 Collaborative Goals' },
            { id: 'podcasts', label: '🎙️ Podcasts' },
            { id: 'live', label: '🔴 Live Sessions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a book, strategy, or win..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handleVoiceInput}
                  disabled={recording}
                  className={`voice-button ${recording ? 'recording' : ''}`}
                >
                  {recording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </button>
              </div>
              {recording && (
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
          </div>
        </motion.div>

        {/* Collaborative Goals Section */}
        {activeTab === 'collaborate' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Create Collaborative Goal</span>
              </h3>
              <p className="text-gray-600 mb-4">Share a goal with your friend and complete it together!</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter goal (e.g., Complete 'Atomic Habits' book)"
                  value={newCollaborativeGoal}
                  onChange={(e) => setNewCollaborativeGoal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={selectedFriend}
                  onChange={(e) => setSelectedFriend(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a friend...</option>
                  <option value="Alex Johnson">Alex Johnson (96% Match)</option>
                  <option value="Maya Kumar">Maya Kumar (92% Match)</option>
                  <option value="Sam Rivera">Sam Rivera (89% Match)</option>
                </select>
                <button
                  onClick={() => {
                    if (newCollaborativeGoal && selectedFriend) {
                      toast.success(`Collaborative goal created with ${selectedFriend}!`);
                      setNewCollaborativeGoal('');
                      setSelectedFriend('');
                    }
                  }}
                  className="w-full btn-primary"
                >
                  Create Collaborative Goal
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <span>Active Collaborations ({collaborativeGoals.length})</span>
            </h3>

            {collaborativeGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{goal.goal}</h4>
                    <p className="text-sm text-gray-600">Collaborating with <span className="font-semibold">{goal.friend}</span></p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {goal.deadline}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-purple-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Update Progress
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Friends Section */}
        {activeTab === 'friends' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <UserPlus className="w-6 h-6 text-green-600" />
                  <span>Friend Requests ({friendRequests.length})</span>
                </h3>
                <div className="space-y-4">
                  {friendRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {request.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-800">{request.name}</h4>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {request.matchPercentage}% Match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">Shared Goals:</p>
                              <div className="flex flex-wrap gap-1">
                                {request.sharedGoals.map((goal, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {goal}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">Interests:</p>
                              <div className="flex flex-wrap gap-1">
                                {request.interests.map((interest, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcceptFriendRequest(request.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejectFriendRequest(request.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends List */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Users className="w-6 h-6 text-purple-600" />
                <span>Your Friends ({friends.length})</span>
              </h3>
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {friend.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{friend.name}</h4>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {friend.matchPercentage}% Match
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Shared Goals:</p>
                            <div className="flex flex-wrap gap-1">
                              {friend.sharedGoals.map((goal, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Interests:</p>
                            <div className="flex flex-wrap gap-1">
                              {friend.interests.map((interest, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Message
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                          Collaborate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Podcasts Section */}
        {activeTab === 'podcasts' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map((podcast, index) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className={`w-full h-40 bg-gradient-to-br ${podcast.color} rounded-xl mb-4 flex items-center justify-center`}>
                    <Radio className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{podcast.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{podcast.speaker}</p>
                  <p className="text-sm text-gray-500 mb-4">{podcast.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">⏱️ {podcast.duration}</span>
                    <span className="text-purple-600 font-semibold">📻 {podcast.listeners.toLocaleString()} listeners</span>
                  </div>
                  <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Listen Now
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Live Sessions Section */}
        {activeTab === 'live' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {liveSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${
                  session.status === 'live' ? 'from-red-50 to-orange-50' : 'from-blue-50 to-purple-50'
                } rounded-2xl p-6 border-2 ${
                  session.status === 'live' ? 'border-red-200' : 'border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{session.title}</h3>
                      {session.status === 'live' && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>LIVE</span>
                        </span>
                      )}
                      {session.status === 'starting soon' && (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Starting Soon
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{session.participants} participants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏰ {session.startTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{session.host} is hosting this session</p>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    {session.status === 'live' ? 'Join Now' : 'Set Reminder'}
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Posts Feed */}
        {activeTab !== 'collaborate' && activeTab !== 'podcasts' && activeTab !== 'live' && activeTab !== 'friends' && (
          <div className="space-y-6">
            {allPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{post.author}</h3>
                      <span className="text-sm text-gray-500">• {post.timestamp}</span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      {post.badges.map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {!post.badges.includes('Friend') && (
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Add Friend
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

              {/* Reactions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  {Object.entries(post.reactions).map(([reaction, count]) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(post.id, reaction)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${getReactionColor(reaction, post.userReactions.includes(reaction))}`}
                    >
                      {getReactionIcon(reaction)}
                      <span className="text-sm font-medium">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {activeTab !== 'collaborate' && activeTab !== 'friends' && allPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share something valuable with the community!</p>
            <button
              onClick={() => setNewPost('')}
              className="btn-primary"
            >
              Create First Post
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
