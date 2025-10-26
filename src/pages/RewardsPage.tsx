import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Gift, Copy, CheckCircle, Clock, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const RewardsPage: React.FC = () => {
  const { coupons, useCoupon: markCouponUsed } = useUser();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  const handleUseCoupon = (couponId: string) => {
    markCouponUsed(couponId);
    toast.success('Coupon marked as used!');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: 'bg-green-100 text-green-800 border-green-200',
      fitness: 'bg-blue-100 text-blue-800 border-blue-200',
      wellness: 'bg-purple-100 text-purple-800 border-purple-200',
      shopping: 'bg-orange-100 text-orange-800 border-orange-200',
      entertainment: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      food: '🍽️',
      fitness: '💪',
      wellness: '🧘',
      shopping: '🛍️',
      entertainment: '🎬'
    };
    return icons[category as keyof typeof icons] || '🎁';
  };

  const activeCoupons = coupons.filter(coupon => !coupon.isUsed);
  const usedCoupons = coupons.filter(coupon => coupon.isUsed);

  const { user } = useUser();
  
  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Rewards 🎁</h1>
          <p className="text-gray-600">Earned coupons from completing microtasks and habits</p>
          
          {/* Progress to next milestone */}
          {user && (
            <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress to 200 Points Reward</span>
                <span className="text-sm font-bold text-purple-600">{user.rewardPoints} / 200 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((user.rewardPoints / 200) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {user.rewardPoints >= 200 
                  ? "🎉 You've unlocked the 200 points reward!" 
                  : `Only ${200 - user.rewardPoints} more points to unlock your milestone coupon!`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Active Coupons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Gift className="w-6 h-6 mr-2 text-green-600" />
            Active Coupons ({activeCoupons.length})
          </h2>
          
          {activeCoupons.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No active coupons yet</h3>
              <p className="text-gray-500">Complete microtasks and habits to earn rewards!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCoupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${
                    coupon.id.startsWith('milestone') ? 'border-4 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-gray-200'
                  }`}
                >
                  {coupon.id.startsWith('milestone') && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                      🎉 MILESTONE REWARD
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(coupon.category)}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{coupon.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(coupon.category)}`}>
                          {coupon.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{coupon.discount}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{coupon.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm">
                        {coupon.code}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleUseCoupon(coupon.id)}
                      className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Mark Used</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Used Coupons */}
        {usedCoupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-gray-600" />
              Used Coupons ({usedCoupons.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {usedCoupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200 opacity-75"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(coupon.category)}</span>
                      <div>
                        <h3 className="font-bold text-gray-600 line-through">{coupon.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(coupon.category)}`}>
                          {coupon.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-400">{coupon.discount}</p>
                    </div>
                  </div>

                  <p className="text-gray-500 mb-4">{coupon.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Used on {new Date(coupon.earnedDate).toLocaleDateString()}</span>
                    </div>
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">
                      Used
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* How to Earn More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <h3 className="text-xl font-bold mb-3">How to Earn More Coupons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">1</span>
              </div>
              <span>Complete daily microtasks</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <span>Maintain habit streaks</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">3</span>
              </div>
              <span>Complete morning/evening check-ins</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">4</span>
              </div>
              <span>Engage with the community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsPage;

