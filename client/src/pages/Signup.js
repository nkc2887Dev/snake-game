import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      alert('Please enter your email');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/signup', { 
        name: name.trim(),
        email: email.trim(), 
        password 
      });
      alert('🎉 Signup successful! Welcome to the Snake Game community!');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(147,51,234,0.1)_0deg,transparent_60deg,rgba(147,51,234,0.1)_120deg,transparent_180deg,rgba(147,51,234,0.1)_240deg,transparent_300deg)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Signup Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-purple-400/20">
          
          {/* Header */}
          <div className="text-center mb-8 slide-in">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-2">
              🚀 Join the Game
            </h1>
            <p className="text-purple-200 text-lg">Create your account and start playing!</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6 fade-in">
            
            {/* Name Field */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                👤 Full Name
              </label>
              <input
                type="text"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                🔐 Password
              </label>
              <input
                type="password"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-xl text-white placeholder-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300"
                placeholder="Create a strong password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2">
                🔒 Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl text-white placeholder-yellow-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </span>
              ) : (
                '🎮 Create Gaming Account'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4 fade-in">
            <div className="flex justify-center space-x-4">
              <Link 
                to="/login" 
                className="text-purple-300 hover:text-white transition-colors duration-300 font-semibold"
              >
                Already have an account? Sign In
              </Link>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 hover:scale-105"
              >
                🏠 Back to Home
              </Link>
            </div>

            {/* Terms */}
            <div className="text-center pt-4">
              <p className="text-purple-300 text-sm">
                By signing up, you agree to have fun playing Snake! 🐍
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
