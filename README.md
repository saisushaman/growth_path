# 🌱 GrowthPath - AI-Powered Personal Growth Platform

A comprehensive web application that helps users overcome social anxiety, build habits, stop procrastinating, and connect with goal-aligned friends through AI coaching, gamification, and community features.

## ✨ Features

### 🎯 Core Features
- **5-Step Onboarding Flow** with voice input simulation
- **AI-Powered Chat Interface** with empathetic responses and crisis detection
- **Daily Check-ins** (Morning & Evening) with point rewards
- **Competitive Leaderboard** with real rewards system
- **Smart Friend Matching** with 90%+ compatibility scoring
- **Community Feed** with posts, reactions, and live events
- **Goals Tracking** with progress visualization
- **Screen Time Analysis** with AI suggestions
- **Panic Support** with breathing exercises and crisis resources

### 🎨 Design Features
- Beautiful gradient-based UI with Tailwind CSS
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Voice input simulation for all text fields
- Point animations and progress tracking
- Confetti celebrations for achievements

### 🤖 AI Integration
- Empathetic AI responses based on user context
- Crisis detection and intervention
- Personalized habit suggestions
- Screen time optimization recommendations
- Goal-based coaching and motivation

## 🤖 AI Integration

### Current Implementation
The app currently uses **high-quality simulated responses** that mimic AI's empathetic style. This is perfect for prototypes and hackathon presentations.

### 🚀 MISTRAL AI Integration (Primary Choice)
To use **Mistral AI** - the recommended AI model for this project:

1. **Get Mistral API Key:**
   - Visit: https://console.mistral.ai/
   - Create account and get API key
   - **Very cost-effective and high-quality!**

2. **Create Environment File:**
   Create a `.env` file in your project root:
   ```bash
   REACT_APP_MISTRAL_API_KEY=your_mistral_api_key_here
   ```

3. **Restart Development Server:**
   ```bash
   npm start
   ```

4. **Automatic Fallback Chain:**
   - **Mistral AI** → OpenAI → Free Models → Simulated responses
   - App always works, even without API keys

### 🆓 FREE AI Integration (Alternative)
To use **completely free AI models**:

1. **Get Free API Key:**
   - Hugging Face: https://huggingface.co/settings/tokens (1000 requests/month FREE!)

2. **Add to Environment File:**
   ```bash
   REACT_APP_HUGGINGFACE_API_KEY=your_free_hf_token_here
   ```

### 💰 Premium AI Integration (Optional)
For other premium models:

1. **Get API Keys:**
   - OpenAI: https://platform.openai.com/

2. **Add to Environment File:**
   ```bash
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

### AI Features
- **Empathetic Responses**: Context-aware coaching based on user goals
- **Crisis Detection**: Automatic detection of mental health concerns
- **Personalized Coaching**: References user's "why" statement and goals
- **Conversation Memory**: Maintains context throughout the chat
- **Fallback System**: Graceful degradation when APIs are unavailable

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd growthpath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 User Flow

1. **Welcome Page** - Introduction and benefits overview
2. **Onboarding** - 5 steps to personalize the experience:
   - Basic info & goals
   - Goal setting with voice input
   - Location & proximity settings
   - Lifestyle assessment
   - Personalized plan generation
3. **Dashboard** - Main hub with stats, habits, and quick actions
4. **AI Chat** - Empathetic coaching conversations
5. **Check-ins** - Morning and evening reflection sessions
6. **Community** - Social features and friend matching
7. **Tracking** - Goals, screen time, and progress monitoring

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Confetti**: React Confetti

## 📊 Data Structure

The app uses localStorage for data persistence with the following structure:

```typescript
interface User {
  name: string;
  age: number;
  goals: string[];
  longTermGoals: string;
  shortTermGoals: string;
  whyStatement: string;
  location: { city: string; radius: number };
  lifestyle: { wakeTime: string; sleepTime: string; exerciseFrequency: string; stressLevel: string };
  rewardPoints: number;
  rank: number;
  phase: number;
  day: number;
  streak: number;
}
```

## 🎯 Key Features Explained

### AI Chat Interface
- Context-aware responses referencing user's goals and "why" statement
- Crisis detection for mental health support
- Empathetic language and actionable advice
- Voice input simulation for accessibility

### Friend Matching
- Swipe interface similar to dating apps
- Compatibility scoring based on shared goals
- Match celebration animations
- Community integration

### Gamification
- Point system for completing habits and check-ins
- Leaderboard with monthly rewards
- Streak tracking and achievements
- Competition alerts and motivation

### Screen Time Analysis
- App usage tracking with visual progress bars
- AI-powered suggestions for healthier habits
- Weekly trend analysis
- Goal setting and progress monitoring

## 🔧 Customization

### Adding New Features
1. Create new components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Update the UserContext for new data types
4. Add navigation links in the dashboard

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Use the design system classes defined in the CSS

### AI Responses
- Modify the `generateAIResponse` function in `AIChat.tsx`
- Add new context patterns and empathetic responses
- Integrate with external AI APIs for production use

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 768px (single column, bottom navigation)
- **Tablet**: 768px - 1023px (1-2 columns, stacked layout)
- **Desktop**: 1024px+ (2-3 columns, sidebar)

## 🎨 Design System

### Colors
- Primary: Indigo-600 (#4F46E5)
- Secondary: Purple-600 (#9333EA)
- Success: Green-600 (#16A34A)
- Warning: Orange-500 (#F97316)
- Danger: Red-600 (#DC2626)

### Gradients
- Blue-to-indigo: from-blue-50 to-indigo-100
- Purple: from-purple-500 to-pink-500
- Gold: from-amber-500 to-orange-600

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure redirects for React Router

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically detect React and deploy
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Inspired by the need for better mental health and personal growth tools
- Built with modern React patterns and best practices
- Designed for accessibility and user experience
- Ready for hackathon submission and further development

---

**Built with ❤️ for personal growth and community connection**
