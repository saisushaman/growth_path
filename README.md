# 🌱 GrowthPath — AI-Powered Personal Growth Platform  
**Empathy meets AI for personal transformation.**  
GrowthPath helps users overcome social anxiety, build habits, stop procrastination, and connect with goal-aligned friends through **AI coaching**, **gamification**, and **community engagement**.


## 🧭 Overview  
GrowthPath is a web app that promotes personal growth through **AI-guided micro-tasks**, **empathetic coaching**, and **social connection**.  
Built with **React + TypeScript + Tailwind CSS**, it focuses on emotional intelligence, behavior tracking, and consistent progress.


## ✨ Core Features  

- 🧠 **AI-Powered Coaching** – Context-aware, empathetic chat with crisis detection.  
- 🎯 **Goal Breakdown** – Primary goals converted into actionable micro-tasks.  
- 🧩 **Smart Friend Matching** – Compatibility scoring based on shared goals and lifestyle.  
- 🌍 **Community Feed** – Collaborative space for posts, reactions, and events.  
- 🕒 **Daily Check-ins** – Reflective sessions with point-based rewards.  
- 🎖️ **Gamification** – Points, streaks, leaderboards, and rewards.  
- 📱 **Screen Time Analysis** – AI recommendations for healthy balance.  
- 🌬️ **Panic Support** – Breathing exercises and crisis resources.  


## 🎨 Design Highlights  

- Beautiful **gradient UI** with Tailwind CSS.  
- Smooth **Framer Motion animations**.  
- Fully **responsive** design for mobile, tablet, and desktop.  
- **Voice input simulation** for accessibility.  
- Gamified elements like **confetti** and **progress animations**.


## 🤖 AI Integration  

### ⚙️ Current Setup – Hugging Face  
GrowthPath uses **Hugging Face free models** (e.g., *flan-t5*, *gpt2*) for all AI responses.  

1. Get your API key → [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)  
2. Add to `.env` file:  
   ```bash
   REACT_APP_HUGGINGFACE_API_KEY=your_free_hf_token_here

   ```

### AI Features
- **Empathetic Responses**: Context-aware coaching based on user goals
- **Crisis Detection**: Automatic detection of mental health concerns
- **Personalized Coaching**: References user's "why" statement and goals
- **Conversation Memory**: Maintains context throughout the chat
- **Fallback System**: Graceful degradation when APIs are unavailable
  

## 🧠 AI Micro-Task Generation Process  

| Step | Description |
|------|--------------|
| **1. Input Parsing** | AI interprets goal intent, difficulty, and category. |
| **2. Prompt Engineering** | Few-shot prompts guide AI to produce small, actionable steps. |
| **3. Generation** | Models like *flan-t5* create empathetic, measurable micro-tasks. |
| **4. Scoring** | Each task gets difficulty, type, and time estimate tags. |
| **5. Personalization** | AI adapts based on user progress and feedback from `localStorage`. |
| **6. Empathy Layer** | Encouraging tone motivates the user after each suggestion. |


**Example:**  
**Input:** “Become confident in public speaking.”  
**Output:**  
1. Practice for 5 minutes daily.  
2. Record a 1-minute talk.  
3. Compliment someone each day.  


## 💞 Friend Matching Algorithm  

| Step | Description |
|------|--------------|
| **Input Data** | Goals, “why” statement, lifestyle, and location. |
| **Vectorization** | Converts user data into numerical vectors. |
| **Weighted Scoring** | Goals (0.6), Interests (0.3), Lifestyle (0.1). |
| **Matching Logic** | Uses cosine similarity for compatibility. |
| **Output** | >0.9 = Perfect Match, >0.7 = Good Match, else Suggested. |


## 🧩 Gamification System  

- Earn **points** for habits, reflections, and check-ins.  
- Track **streaks** and compete on the **leaderboard**.  
- **Confetti celebrations** for milestones.  
- **Coupons** unlock at 200 points.  



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


## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 768px (single column, bottom navigation)
- **Tablet**: 768px - 1023px (1-2 columns, stacked layout)
- **Desktop**: 1024px+ (2-3 columns, sidebar)

## 🚀 Deployment

### Vercel

Deployed our website in vercel : https://vercel.com/sushamas-projects/growth-path


## 🎉 Acknowledgments

- Inspired by the need for better mental health and personal growth tools
- Built with modern React patterns and best practices
- Designed for accessibility and user experience
- Ready for hackathon submission and further development


**Built with ❤️ for personal growth and community connection**
