import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Users, UserPlus, Target, MessageCircle, Heart, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  sharedGoals: string[];
  compatibilityScore: number;
  status: 'friend' | 'suggested';
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions'>('friends');

  // Generate friend suggestions based on goals
  const generateFriendSuggestions = (): Friend[] => {
    if (!user?.goals) return [];

    const allUsers = [
      { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { name: 'Sam Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
      { name: 'Jordan Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
      { name: 'Maya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya' },
      { name: 'Ryan Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan' },
    ];

    return allUsers.map((userData, index) => {
      // Find shared goals
      const potentialGoals = user.goals || [];
      const sharedGoals = potentialGoals.slice(0, Math.floor(Math.random() * 2) + 1);
      
      return {
        id: `user_${index}`,
        name: userData.name,
        avatar: userData.avatar,
        sharedGoals,
        compatibilityScore: Math.floor(75 + Math.random() * 25),
        status: index < 2 ? 'friend' as const : 'suggested' as const
      };
    });
  };

  const [friendList] = useState<Friend[]>(generateFriendSuggestions());
  const myFriends = friendList.filter(f => f.status === 'friend');
  const suggestions = friendList.filter(f => f.status === 'suggested');

  const handleAddFriend = (friendId: string) => {
    toast.success('Friend request sent!');
  };

  const handleStartChat = (friendId: string) => {
    toast.success('Opening chat...');
  };

  const handleCollaborate = (goal: string) => {
    toast.success(`Collaborating on: ${goal}`);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Friends & Community 🤝</h1>
            <p className="text-gray-600">Connect with like-minded people working toward similar goals</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex space-x-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'friends' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>My Friends ({myFriends.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'suggestions' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Suggestions ({suggestions.length})</span>
          </button>
        </motion.div>

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {myFriends.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No friends yet</h3>
                <p className="text-gray-500 mb-4">Start by adding friends from the suggestions tab!</p>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className="btn-primary"
                >
                  View Suggestions
                </button>
              </div>
            ) : (
              myFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full border-4 border-purple-200"
                    />
                    
                    {/* Friend Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{friend.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {friend.compatibilityScore}% match
                          </span>
                        </div>
                      </div>
                      
                      {/* Shared Goals */}
                      {friend.sharedGoals.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">Shared Goals:</span>
                          </div>
                          <div className="space-y-2">
                            {friend.sharedGoals.map((goal, idx) => (
                              <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{goal}</p>
                                    <p className="text-xs text-gray-600">Collaborate to complete this together!</p>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCollaborate(goal)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700"
                                  >
                                    Collaborate
                                  </motion.button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStartChat(friend.id)}
                          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Send Support</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-16 h-16 rounded-full border-4 border-blue-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{friend.name}</h3>
                    <p className="text-sm text-gray-600">{friend.compatibilityScore}% compatibility</p>
                  </div>
                </div>

                {friend.sharedGoals.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Shared Goals:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {friend.sharedGoals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddFriend(friend.id)}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Add Friend
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    View Profile
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
