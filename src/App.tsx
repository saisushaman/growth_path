import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Welcome from './pages/Welcome';
import OnboardingStep1 from './pages/onboarding/OnboardingStep1';
import OnboardingStep2 from './pages/onboarding/OnboardingStep2';
import OnboardingStep3 from './pages/onboarding/OnboardingStep3';
import OnboardingStep4 from './pages/onboarding/OnboardingStep4';
import OnboardingStep5 from './pages/onboarding/OnboardingStep5';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/GrokAIChat';
import Leaderboard from './pages/Leaderboard';
import FriendMatching from './pages/FriendMatching';
import FriendsPage from './pages/FriendsPage';
import CommunityFeed from './pages/CommunityFeed';
import LiveEvents from './pages/LiveEvents';
import GoalsTracking from './pages/GoalsTracking';
import ScreenTimeAnalysis from './pages/ScreenTimeAnalysis';
import PanicSupport from './pages/PanicSupport';
import MorningCheckIn from './pages/checkins/MorningCheckIn';
import EveningCheckIn from './pages/checkins/EveningCheckIn';
import RewardsPage from './pages/RewardsPage';
import BehaviorAnalysisPage from './pages/BehaviorAnalysisPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen gradient-bg">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/onboarding/1" element={
              <ProtectedRoute>
                <OnboardingStep1 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/2" element={
              <ProtectedRoute>
                <OnboardingStep2 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/3" element={
              <ProtectedRoute>
                <OnboardingStep3 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/4" element={
              <ProtectedRoute>
                <OnboardingStep4 />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/5" element={
              <ProtectedRoute>
                <OnboardingStep5 />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
                <Route path="/ai-chat" element={
                  <ProtectedRoute>
                    <AIChat />
                  </ProtectedRoute>
                } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
                <Route path="/friends" element={
                  <ProtectedRoute>
                    <FriendsPage />
                  </ProtectedRoute>
                } />
                <Route path="/match" element={
                  <ProtectedRoute>
                    <FriendMatching />
                  </ProtectedRoute>
                } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityFeed />
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <LiveEvents />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <GoalsTracking />
              </ProtectedRoute>
            } />
            <Route path="/screentime" element={
              <ProtectedRoute>
                <ScreenTimeAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/panic" element={
              <ProtectedRoute>
                <PanicSupport />
              </ProtectedRoute>
            } />
            <Route path="/checkin/morning" element={
              <ProtectedRoute>
                <MorningCheckIn />
              </ProtectedRoute>
            } />
                <Route path="/checkin/evening" element={
                  <ProtectedRoute>
                    <EveningCheckIn />
                  </ProtectedRoute>
                } />
                <Route path="/rewards" element={
                  <ProtectedRoute>
                    <RewardsPage />
                  </ProtectedRoute>
                } />
                <Route path="/behavior-analysis" element={
                  <ProtectedRoute>
                    <BehaviorAnalysisPage />
                  </ProtectedRoute>
                } />
              </Routes>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
