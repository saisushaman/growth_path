// Mock Data Generator for GrowthPath
// This file generates realistic fake data to demonstrate the app with actual usage

export const generateMockUserData = () => {
  return {
    id: 'user_demo_001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: 28,
    goals: ['overcome social anxiety', 'build daily habits', 'improve networking'],
    longTermGoals: 'Build confidence to speak in public and network professionally',
    shortTermGoals: 'Complete a 10-day social confidence challenge',
    whyStatement: 'I want to overcome my fear of public speaking so I can advance my career and build meaningful relationships',
    location: {
      city: 'New York, NY',
      radius: 25
    },
    lifestyle: {
      wakeTime: '07:00',
      sleepTime: '23:00',
      exerciseFrequency: '3-4 times a week',
      stressLevel: 'moderate'
    },
    rewardPoints: 3450,
    rank: 12,
    phase: 2,
    day: 15,
    streak: 12,
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: new Date().toISOString(),
    microTasksCompletedToday: 3,
    totalMicroTasksCompleted: 42
  };
};

export const generateMockHabits = () => [
  {
    id: 1,
    description: 'Practice deep breathing for 5 minutes',
    completed: true,
    streak: 15,
    lastCompleted: new Date().toISOString()
  },
  {
    id: 2,
    description: 'Make eye contact with 3 people today',
    completed: true,
    streak: 8,
    lastCompleted: new Date().toISOString()
  },
  {
    id: 3,
    description: 'Attend one social event',
    completed: false,
    streak: 5,
    lastCompleted: '2024-01-20T10:00:00Z'
  },
  {
    id: 4,
    description: 'Practice gratitude journaling',
    completed: true,
    streak: 20,
    lastCompleted: new Date().toISOString()
  }
];

export const generateMockGoals = () => [
  {
    id: 'goal_001',
    text: 'Attend 3 networking events this month',
    completed: false,
    goalType: 'project',
    timeRequired: '2-3 hours per event',
    resources: ['Eventbrite', 'Meetup app'],
    successCriteria: 'Have 5 meaningful conversations'
  },
  {
    id: 'goal_002',
    text: 'Complete "Social Anxiety Workbook"',
    completed: true,
    goalType: 'learning',
    timeRequired: '30 mins daily',
    resources: ['Workbook PDF'],
    successCriteria: 'Finish all 12 chapters'
  },
  {
    id: 'goal_003',
    text: 'Run a 5K by end of month',
    completed: false,
    goalType: 'habit',
    timeRequired: '30-45 mins daily',
    resources: ['Treadmill', 'Running shoes'],
    successCriteria: 'Complete 5K run in under 30 mins'
  }
];

export const generateMockMicroTasks = () => [
  {
    id: 1,
    title: 'Make eye contact with one person during conversation',
    instruction: 'Focus on maintaining it for 3-5 seconds',
    points: 25,
    impact: 'Builds confidence and shows presence in conversations',
    why: 'Eye contact creates connection and reduces anxiety by making you feel more engaged'
  }
];

export const generateMockCheckIns = () => [
  {
    id: 'check_001',
    type: 'morning' as const,
    date: new Date().toISOString(),
    mood: 'hopeful',
    notes: 'Feeling good about today\'s networking event. Excited but nervous.'
  },
  {
    id: 'check_002',
    type: 'evening' as const,
    date: new Date().toISOString(),
    mood: 'accomplished',
    notes: 'Made it through the event! Talked to 2 new people and exchanged contacts.'
  }
];

export const generateMockFriends = () => [
  {
    id: 'friend_001',
    name: 'Sam Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    sharedGoals: ['overcome social anxiety', 'build daily habits'],
    compatibilityScore: 92
  },
  {
    id: 'friend_002',
    name: 'Maya Kumar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    sharedGoals: ['improve networking', 'public speaking'],
    compatibilityScore: 89
  }
];

export const generateMockCoupons = () => [
  {
    id: 'coupon_001',
    title: 'Healthy Meal Discount',
    description: '20% off your next healthy meal order',
    discount: '20% OFF',
    code: 'HEALTHY20',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'food' as const,
    earnedDate: new Date().toISOString(),
    isUsed: false
  },
  {
    id: 'coupon_002',
    title: 'Fitness Class Pass',
    description: 'Free trial class at any fitness studio',
    discount: 'FREE TRIAL',
    code: 'FITNESS2024',
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'fitness' as const,
    earnedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isUsed: true
  }
];

export const generateMockPosts = () => [
  {
    id: 'post_001',
    authorId: 'user_demo_001',
    authorName: 'Alex Johnson',
    content: 'Just finished my first networking event since joining GrowthPath! Talked to 3 new people and felt confident. Small wins count! 🎉',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: {
      heart: 12,
      like: 28,
      insightful: 8
    },
    userReactions: ['heart']
  }
];

export const generateMockCollaborativeGoals = () => [
  {
    id: 'collab_001',
    goal: 'Complete "Atomic Habits" book together',
    friend: 'Sam Rivera',
    progress: 65,
    deadline: '5 days left'
  },
  {
    id: 'collab_002',
    goal: 'Attend 2 networking events together',
    friend: 'Maya Kumar',
    progress: 50,
    deadline: '10 days left'
  }
];

export const generateMockScreenTime = () => [
  { app: 'Instagram', usage: 35, goal: 30, color: 'red' },
  { app: 'TikTok', usage: 28, goal: 30, color: 'green' },
  { app: 'YouTube', usage: 45, goal: 40, color: 'orange' }
];

export const generateMockLeaderboard = () => [
  { rank: 1, name: 'Emma Wilson', points: 5240, avatar: 'EW' },
  { rank: 2, name: 'Ryan Taylor', points: 4890, avatar: 'RT' },
  { rank: 3, name: 'Sofia Martinez', points: 4560, avatar: 'SM' }
];

export const generateMockLiveEvents = () => [
  {
    id: 'live_001',
    title: 'Morning Mindfulness Session',
    host: 'Dr. Sarah Chen',
    participants: 23,
    status: 'live',
    startTime: '7:00 AM'
  },
  {
    id: 'live_002',
    title: 'Evening Goal Planning',
    host: 'Alex Johnson',
    participants: 47,
    status: 'starting soon',
    startTime: '8:00 PM'
  }
];

// Initialize all mock data
export const initializeMockData = () => {
  localStorage.setItem('growthpath_user', JSON.stringify(generateMockUserData()));
  localStorage.setItem('growthpath_habits_user_demo_001', JSON.stringify(generateMockHabits()));
  
  // Additional mock data would be set here
  return {
    user: generateMockUserData(),
    habits: generateMockHabits(),
    goals: generateMockGoals(),
    microTasks: generateMockMicroTasks(),
    checkIns: generateMockCheckIns(),
    friends: generateMockFriends(),
    coupons: generateMockCoupons(),
    posts: generateMockPosts(),
    collaborativeGoals: generateMockCollaborativeGoals(),
    screenTime: generateMockScreenTime(),
    leaderboard: generateMockLeaderboard(),
    liveEvents: generateMockLiveEvents()
  };
};

