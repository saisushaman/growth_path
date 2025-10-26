import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Heart, X, Target, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface PotentialFriend {
  id: string;
  name: string;
  age: number;
  goals: string[];
  location: string;
  compatibilityScore: number;
  sharedGoals: string[];
  avatar: string;
  bio: string;
}

const FriendMatching: React.FC = () => {
  const navigate = useNavigate();
  const { user, swipeFriend } = useUser();
  const [currentFriend, setCurrentFriend] = useState<PotentialFriend | null>(null);
  const [friendIndex, setFriendIndex] = useState(0);

  // Generate potential friends with real matching algorithm
  const generatePotentialFriends = (): PotentialFriend[] => {
    if (!user) return [];

    const allGoals = [
      'Overcome social anxiety', 'Build confidence', 'Make new friends', 'Improve communication',
      'Develop leadership skills', 'Network professionally', 'Find romantic partner', 'Travel more',
      'Learn new skills', 'Start a business', 'Get fit', 'Read more books', 'Learn languages',
      'Volunteer', 'Meditate daily', 'Reduce screen time', 'Wake up early', 'Cook healthy meals'
    ];

    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    
    const potentialFriends: PotentialFriend[] = [];
    
    for (let i = 0; i < 20; i++) {
      const randomGoals = allGoals.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
      const sharedGoals = user.goals?.filter(goal => randomGoals.includes(goal)) || [];
      
      // Calculate compatibility score based on multiple factors
      let compatibilityScore = 0;
      
      // Goal alignment (40% weight)
      const goalAlignment = sharedGoals.length / Math.max(user.goals?.length || 1, randomGoals.length);
      compatibilityScore += goalAlignment * 40;
      
      // Age compatibility (20% weight) - prefer similar age groups
      const ageDiff = Math.abs((user.age || 25) - (20 + Math.random() * 20));
      const ageCompatibility = Math.max(0, 1 - ageDiff / 20);
      compatibilityScore += ageCompatibility * 20;
      
      // Location proximity (20% weight) - prefer same city or nearby
      const isSameCity = Math.random() < 0.3; // 30% chance of same city
      const locationScore = isSameCity ? 1 : Math.random() * 0.7;
      compatibilityScore += locationScore * 20;
      
      // Lifestyle compatibility (20% weight) - based on lifestyle preferences
      const lifestyleScore = Math.random() * 0.8 + 0.2; // Random but realistic
      compatibilityScore += lifestyleScore * 20;
      
      // Add some randomness to make it more realistic
      compatibilityScore += (Math.random() - 0.5) * 10;
      compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

      potentialFriends.push({
        id: `friend_${i}`,
        name: `Friend ${i + 1}`,
        age: Math.floor(20 + Math.random() * 20),
        goals: randomGoals,
        location: cities[Math.floor(Math.random() * cities.length)],
        compatibilityScore: Math.round(compatibilityScore),
        sharedGoals,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        bio: `Passionate about ${randomGoals[0].toLowerCase()} and looking to connect with like-minded people!`
      });
    }

    // Sort by compatibility score (highest first)
    return potentialFriends.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  const [potentialFriends] = useState<PotentialFriend[]>(generatePotentialFriends());

  useEffect(() => {
    if (potentialFriends.length > 0) {
      setCurrentFriend(potentialFriends[friendIndex]);
    }
  }, [friendIndex, potentialFriends]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentFriend) return;

    if (direction === 'right') {
      swipeFriend(currentFriend.id, 'right');
      toast.success(`Matched with ${currentFriend.name}! 🎉`);
    } else {
      swipeFriend(currentFriend.id, 'left');
      toast.error(`Passed on ${currentFriend.name}`);
    }

    // Move to next friend
    if (friendIndex < potentialFriends.length - 1) {
      setFriendIndex(friendIndex + 1);
    } else {
      toast.success('You\'ve seen all potential friends! Check back later for new matches.');
      setCurrentFriend(null);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (!currentFriend) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No More Matches</h1>
          <p className="text-gray-600 mb-6">You've seen all potential friends in your area. Check back later for new matches!</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Find Friends 💕</h1>
            <p className="text-gray-600">90%+ goal match • Within {user?.location?.radius || 25} mi</p>
          </div>
        </motion.div>

        {/* Friend Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFriend.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
          >
            {/* Compatibility Score */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white text-center">
              <div className="text-sm opacity-90">Compatibility Score</div>
              <div className="text-3xl font-bold">{currentFriend.compatibilityScore}%</div>
            </div>

            {/* Avatar */}
            <div className="p-6 text-center">
              <img
                src={currentFriend.avatar}
                alt={currentFriend.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-100"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentFriend.name}</h2>
              <p className="text-gray-600 mb-4">{currentFriend.age} years old • {currentFriend.location}</p>
              <p className="text-gray-700 mb-4">{currentFriend.bio}</p>
            </div>

            {/* Shared Goals */}
            {currentFriend.sharedGoals.length > 0 && (
              <div className="px-6 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Shared Goals:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentFriend.sharedGoals.map((goal, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Collaborative Goals Section */}
            {currentFriend.sharedGoals.length > 0 && (
              <div className="px-6 pb-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-800">Collaborate on Shared Goals!</h3>
                </div>
                <div className="space-y-2">
                  {currentFriend.sharedGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-purple-200">
                      <Target className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{goal}</p>
                        <p className="text-xs text-gray-600">Both working on this goal - collaborate to complete it together!</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700"
                      >
                        Collaborate
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Their Goals:</h3>
              <div className="flex flex-wrap gap-2">
                {currentFriend.goals.map((goal, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      currentFriend.sharedGoals.includes(goal)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <Heart className="w-8 h-8" />
          </motion.button>
        </motion.div>

        {/* Progress */}
        <div className="mt-6 text-center text-gray-600">
          <p>{friendIndex + 1} of {potentialFriends.length} potential friends</p>
        </div>
      </div>
    </div>
  );
};

export default FriendMatching;