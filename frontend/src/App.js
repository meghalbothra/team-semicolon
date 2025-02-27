// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AiChat from './pages/AiChat';
import MentalHealthResource from './pages/ResourcePage';
import Quiz from './pages/Quiz';
import Meditation from './pages/GuidedMeditation';
import Signup from './pages/Signup';
import Peerchat from './pages/PeerChat';
import AboutPage from './pages/About';
import { auth } from '../src/Firebase/Firebase'; // Ensure you export auth from your firebase.js
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Show a loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <div className="flex-grow">
          <Routes>
            {/* Always redirect the root to signup */}
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            {/* Home page is only accessible when logged in */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<AiChat />} />
            <Route path="/resources" element={<MentalHealthResource />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/peer-chat" element={<Peerchat />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
