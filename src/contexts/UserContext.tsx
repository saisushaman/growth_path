import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For internal use only
  age?: number;
  goals?: string[];
  longTermGoals?: string;
  shortTermGoals?: string;
  whyStatement?: string;
  location?: {
    city: string;
    radius: number;
  };
  lifestyle?: {
    wakeTime: string;
    sleepTime: string;
    exerciseFrequency: string;
    stressLevel: string;
  };
  rewardPoints: number;
  rank: number;
  phase: number;
  day: number;
  streak: number;
  createdAt: string;
  lastLogin: string;
  microTasksCompletedToday: number;
  totalMicroTasksCompleted: number;
}

export interface Habit {
  id: number;
  description: string;
  completed: boolean;
  streak: number;
  category: string;
}

export interface CheckIn {
  date: string;
  type: 'morning' | 'evening';
  mood?: number;
  energy?: string;
  focus?: string;
  socialEvents?: boolean;
  feeling?: string;
  habitCompleted?: string;
  bestMoment?: string;
  socialQuality?: number;
  meals?: string[];
  challenge?: string;
  intention?: string;
}

export interface Friend {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: number;
  matchScore: number;
  bio: string;
  sharedGoals: string[];
  recentAchievement: string;
  avatar: string;
}

export interface CommunityPost {
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
}

export interface LiveEvent {
  id: string;
  title: string;
  host: string;
  attendees: number;
  duration: number;
  topic: string;
  isLive: boolean;
  startTime?: string;
}

export interface ScreenTimeData {
  app: string;
  usage: number;
  goal: number;
  color: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiryDate: string;
  category: 'food' | 'fitness' | 'wellness' | 'shopping' | 'entertainment';
  earnedDate: string;
  isUsed: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  habits: Habit[];
  checkIns: CheckIn[];
  friends: string[];
  posts: CommunityPost[];
  events: LiveEvent[];
  screenTime: ScreenTimeData[];
  coupons: Coupon[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addPoints: (points: number) => void;
  completeHabit: (habitId: number) => void;
  completeMicroTask: () => void;
  addCheckIn: (checkIn: CheckIn) => void;
  addPost: (post: Omit<CommunityPost, 'id'>) => void;
  reactToPost: (postId: string, reaction: string) => void;
  swipeFriend: (friendId: string, direction: 'left' | 'right') => void;
  useCoupon: (couponId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [screenTime, setScreenTime] = useState<ScreenTimeData[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const isAuthenticated = !!user;

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('growthpath_user');
    const savedHabits = localStorage.getItem('growthpath_habits');
    const savedCheckIns = localStorage.getItem('growthpath_checkins');
    const savedFriends = localStorage.getItem('growthpath_friends');
    const savedPosts = localStorage.getItem('growthpath_posts');
    const savedEvents = localStorage.getItem('growthpath_events');
    const savedScreenTime = localStorage.getItem('growthpath_screentime');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    if (savedScreenTime) {
      setScreenTime(JSON.parse(savedScreenTime));
    } else {
      // Initialize with sample data
      setScreenTime([
        { app: 'Instagram', usage: 45, goal: 30, color: 'red' },
        { app: 'TikTok', usage: 32, goal: 30, color: 'orange' },
        { app: 'YouTube', usage: 28, goal: 40, color: 'green' }
      ]);
    }
  }, []);

  // Save to localStorage whenever data changes (user-specific)
  useEffect(() => {
    if (user) {
      localStorage.setItem('growthpath_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_habits_${user.id}`, JSON.stringify(habits));
    }
  }, [habits, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_checkins_${user.id}`, JSON.stringify(checkIns));
    }
  }, [checkIns, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_friends_${user.id}`, JSON.stringify(friends));
    }
  }, [friends, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_posts_${user.id}`, JSON.stringify(posts));
    }
  }, [posts, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_events_${user.id}`, JSON.stringify(events));
    }
  }, [events, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_screentime_${user.id}`, JSON.stringify(screenTime));
    }
  }, [screenTime, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`growthpath_coupons_${user.id}`, JSON.stringify(coupons));
    }
  }, [coupons, user]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const addPoints = (points: number) => {
    setUser(prev => {
      if (!prev) return null;
      
      const newPoints = prev.rewardPoints + points;
      const newRewardPoints = { ...prev, rewardPoints: newPoints };
      
      // Award coupon at 200 points milestone
      if (prev.rewardPoints < 200 && newPoints >= 200) {
        const milestoneCoupon: Coupon = {
          id: `milestone_200_${Date.now()}`,
          title: "200 Points Achievement Reward",
          description: "Congratulations on reaching 200 reward points! Enjoy this special discount.",
          discount: "50% OFF",
          code: "MILESTONE200",
          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
          category: "shopping" as const,
          earnedDate: new Date().toISOString(),
          isUsed: false
        };
        setCoupons(coupons => [...coupons, milestoneCoupon]);
      }
      
      return newRewardPoints;
    });
  };

  const completeHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: true, streak: habit.streak + 1 }
        : habit
    ));
    addPoints(50);
  };

  const completeMicroTask = () => {
    if (!user) return;
    
    // Update user's microtask counts
    const updatedUser = {
      ...user,
      microTasksCompletedToday: user.microTasksCompletedToday + 1,
      totalMicroTasksCompleted: user.totalMicroTasksCompleted + 1
    };
    setUser(updatedUser);
    
    // Add points for microtask completion
    addPoints(25);
    
    // Randomly award coupon (30% chance)
    if (Math.random() < 0.3) {
      const newCoupon = generateRandomCoupon();
      setCoupons(prev => [...prev, newCoupon]);
    }
  };

  const generateRandomCoupon = (): Coupon => {
    const couponTemplates = [
      {
        title: "Healthy Meal Discount",
        description: "20% off your next healthy meal order",
        discount: "20% OFF",
        code: "HEALTHY20",
        category: "food" as const
      },
      {
        title: "Fitness Class Pass",
        description: "Free trial class at any fitness studio",
        discount: "FREE TRIAL",
        code: "FITNESS2024",
        category: "fitness" as const
      },
      {
        title: "Wellness Spa Day",
        description: "15% off spa and wellness services",
        discount: "15% OFF",
        code: "RELAX15",
        category: "wellness" as const
      },
      {
        title: "Motivational Book",
        description: "25% off personal development books",
        discount: "25% OFF",
        code: "GROWTH25",
        category: "shopping" as const
      },
      {
        title: "Entertainment Credit",
        description: "$5 off streaming services",
        discount: "$5 OFF",
        code: "STREAM5",
        category: "entertainment" as const
      }
    ];
    
    const template = couponTemplates[Math.floor(Math.random() * couponTemplates.length)];
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    
    return {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      discount: template.discount,
      code: template.code,
      expiryDate: expiryDate.toISOString(),
      category: template.category,
      earnedDate: new Date().toISOString(),
      isUsed: false
    };
  };

  const useCoupon = (couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, isUsed: true }
        : coupon
    ));
  };

  const addCheckIn = (checkIn: CheckIn) => {
    setCheckIns(prev => [...prev, checkIn]);
    addPoints(30);
  };

  const addPost = (post: Omit<CommunityPost, 'id'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
    };
    setPosts(prev => [newPost, ...prev]);
    addPoints(25);
  };

  const reactToPost = (postId: string, reaction: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const userReactions = [...post.userReactions];
        const reactionIndex = userReactions.indexOf(reaction);
        
        if (reactionIndex > -1) {
          // Remove reaction
          userReactions.splice(reactionIndex, 1);
          post.reactions[reaction as keyof typeof post.reactions]--;
        } else {
          // Add reaction
          userReactions.push(reaction);
          post.reactions[reaction as keyof typeof post.reactions]++;
        }
        
        return { ...post, userReactions };
      }
      return post;
    }));
  };

  const swipeFriend = (friendId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      setFriends(prev => [...prev, friendId]);
    }
    // In a real app, this would also update the potential friends list
  };

  // Authentication methods
  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, this would make an API call
    const users = JSON.parse(localStorage.getItem('growthpath_users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Update last login
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    
    // Update user in storage
    const updatedUsers = users.map((u: User) => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('growthpath_users', JSON.stringify(updatedUsers));
    
    // Set current user
    setUser(updatedUser);
    
    // Load user-specific data
    loadUserData(user.id);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('growthpath_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password, // In real app, hash this
          rewardPoints: 0,
          rank: 1,
          phase: 1,
          day: 1,
          streak: 0,
          microTasksCompletedToday: 0,
          totalMicroTasksCompleted: 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('growthpath_users', JSON.stringify(users));
    
    // Set current user
    setUser(newUser);
    
    // Initialize user-specific data
    initializeUserData(newUser.id);
  };

  const logout = () => {
    setUser(null);
    setHabits([]);
    setCheckIns([]);
    setFriends([]);
    setPosts([]);
    setEvents([]);
    setScreenTime([]);
    setCoupons([]);
    
    // Clear localStorage
    localStorage.removeItem('growthpath_user');
    localStorage.removeItem('growthpath_habits');
    localStorage.removeItem('growthpath_checkins');
    localStorage.removeItem('growthpath_friends');
    localStorage.removeItem('growthpath_posts');
    localStorage.removeItem('growthpath_events');
    localStorage.removeItem('growthpath_screentime');
  };

  const loadUserData = (userId: string) => {
    const savedHabits = localStorage.getItem(`growthpath_habits_${userId}`);
    const savedCheckIns = localStorage.getItem(`growthpath_checkins_${userId}`);
    const savedFriends = localStorage.getItem(`growthpath_friends_${userId}`);
    const savedPosts = localStorage.getItem(`growthpath_posts_${userId}`);
    const savedEvents = localStorage.getItem(`growthpath_events_${userId}`);
    const savedScreenTime = localStorage.getItem(`growthpath_screentime_${userId}`);
    const savedCoupons = localStorage.getItem(`growthpath_coupons_${userId}`);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    }
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
    if (savedScreenTime) {
      setScreenTime(JSON.parse(savedScreenTime));
    } else {
      // Initialize with sample data
      setScreenTime([
        { app: 'Instagram', usage: 45, goal: 30, color: 'red' },
        { app: 'TikTok', usage: 32, goal: 30, color: 'orange' },
        { app: 'YouTube', usage: 28, goal: 40, color: 'green' }
      ]);
    }
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      setCoupons([]);
    }
  };

  const initializeUserData = (userId: string) => {
    // Initialize with empty arrays for new users
    localStorage.setItem(`growthpath_habits_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_checkins_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_friends_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_posts_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_events_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_coupons_${userId}`, JSON.stringify([]));
    localStorage.setItem(`growthpath_screentime_${userId}`, JSON.stringify([
      { app: 'Instagram', usage: 45, goal: 30, color: 'red' },
      { app: 'TikTok', usage: 32, goal: 30, color: 'orange' },
      { app: 'YouTube', usage: 28, goal: 40, color: 'green' }
    ]));
    
    setHabits([]);
    setCheckIns([]);
    setFriends([]);
    setPosts([]);
    setEvents([]);
    setCoupons([]);
    setScreenTime([
      { app: 'Instagram', usage: 45, goal: 30, color: 'red' },
      { app: 'TikTok', usage: 32, goal: 30, color: 'orange' },
      { app: 'YouTube', usage: 28, goal: 40, color: 'green' }
    ]);
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    habits,
    checkIns,
    friends,
    posts,
    events,
    screenTime,
    coupons,
    login,
    register,
    logout,
    updateUser,
    addPoints,
    completeHabit,
    completeMicroTask,
    addCheckIn,
    addPost,
    reactToPost,
    swipeFriend,
    useCoupon,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
