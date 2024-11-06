import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/Login';
import ChatOverlay from './components/chat/ChatOverlay';
import FriendsOverlay from './components/friends/FriendsOverlay';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            </Routes>
          </div>
          <ChatOverlay />
          <FriendsOverlay />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;