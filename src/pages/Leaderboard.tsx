import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Trophy, Gift, Coffee, Pen, Star } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const leaderboardData = [
    { rank: 1, name: 'Sarah Chen', points: 4850, streak: 45, avatar: 'SC', badge: '🏆' },
    { rank: 2, name: 'Alex Johnson', points: 4720, streak: 38, avatar: 'AJ', badge: '🥈' },
    { rank: 3, name: 'Maya Kumar', points: 4580, streak: 42, avatar: 'MK', badge: '🥉' },
    { rank: 4, name: 'David Park', points: 4320, streak: 35, avatar: 'DP', badge: '4' },
    { rank: 5, name: 'Emma Wilson', points: 4150, streak: 28, avatar: 'EW', badge: '5' },
    { rank: 6, name: 'Sam Rivera', points: 3980, streak: 31, avatar: 'SR', badge: '6' },
    { rank: 7, name: 'Lisa Chen', points: 3850, streak: 33, avatar: 'LC', badge: '7' },
    { rank: 8, name: 'Mike Torres', points: 3720, streak: 26, avatar: 'MT', badge: '8' },
    { rank: 9, name: 'Anna Lee', points: 3650, streak: 29, avatar: 'AL', badge: '9' },
    { rank: 10, name: 'Chris Brown', points: 3520, streak: 24, avatar: 'CB', badge: '10' },
  ];

  const rewards = [
    {
      rank: '1-3',
      title: 'Premium Subscription + Trophy',
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      color: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      rank: '4-10',
      title: 'GrowthPath Mug + Stickers + Pen Set',
      icon: <Coffee className="w-6 h-6 text-blue-500" />,
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      rank: '11-25',
      title: 'Inspirational Pen Set',
      icon: <Pen className="w-6 h-6 text-purple-500" />,
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      rank: '26-50',
      title: '$10 Amazon Gift Card',
      icon: <Gift className="w-6 h-6 text-green-500" />,
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      rank: '51-100',
      title: 'Digital Achievement Badge',
      icon: <Star className="w-6 h-6 text-indigo-500" />,
      color: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200'
    }
  ];

  const pointActions = [
    { points: 50, action: 'Complete daily habit', icon: '🎯' },
    { points: 100, action: '7-day streak', icon: '🔥' },
    { points: 30, action: 'Complete check-in', icon: '✅' },
    { points: 75, action: 'Reduce screen time 20%', icon: '📱' },
    { points: 25, action: 'Post to community', icon: '💬' },
    { points: 150, action: 'Hit fitness goal', icon: '🏃' }
  ];

  const userRank = user?.rank || 47;
  const userPoints = user?.rewardPoints || 1250;
  const userStreak = user?.streak || 5;

  return (
    <div className="min-h-screen gradient-bg px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600">Top performers this month</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>

        {/* Your Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">Your Stats</h2>
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-sm text-indigo-600">Your Rank</p>
                  <p className="text-2xl font-bold text-indigo-700">#{userRank}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Your Points</p>
                  <p className="text-2xl font-bold text-indigo-700">{userPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600">Streak</p>
                  <p className="text-2xl font-bold text-indigo-700">{userStreak} days</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-indigo-600 text-lg font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <p className="text-sm text-indigo-600">Keep going!</p>
            </div>
          </div>
        </motion.div>

        {/* Monthly Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎁 Monthly Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`bg-gradient-to-br ${reward.color} rounded-xl p-4 border ${reward.borderColor}`}
              >
                <div className="flex items-center mb-2">
                  {reward.icon}
                  <span className="ml-2 font-semibold text-gray-800">Rank {reward.rank}</span>
                </div>
                <p className="text-sm text-gray-700">{reward.title}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Rewards shipped at end of month
          </p>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Top Performers</h2>
          <div className="space-y-3">
            {leaderboardData.map((person, index) => (
              <motion.div
                key={person.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  person.rank === userRank
                    ? 'bg-indigo-50 border-2 border-indigo-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                    {person.badge}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {person.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {person.name}
                      {person.rank === userRank && <span className="text-indigo-600 ml-2">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-600">{person.streak}-day streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{person.points.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">How to Earn Points</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pointActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="text-lg font-bold text-indigo-600">+{action.points}</p>
                <p className="text-sm text-gray-700">{action.action}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;

