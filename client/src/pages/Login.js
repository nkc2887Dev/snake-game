import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [view, isView] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/login', { email });
      alert('OTP sent successfully! Check your email.');
      isView(true);
    } catch (error) {
      alert('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp });
      alert('Login successful! Welcome back!');
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      alert('Invalid OTP. Please try again.');
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
        {/* Login Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl border border-purple-400/20">
          
          {/* Header */}
          <div className="text-center mb-8 slide-in">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
              🎮 Welcome Back
            </h1>
            <p className="text-purple-200 text-lg">Sign in to continue your gaming journey</p>
          </div>

          {!view ? (
            /* Email Form */
            <form onSubmit={handleSubmit} className="space-y-6 fade-in">
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending OTP...
                  </span>
                ) : (
                  '🚀 Send OTP'
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification */
            <div className="space-y-6 slide-in">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-purple-200 text-lg">
                  We sent a verification code to
                </p>
                <p className="text-white font-semibold text-lg">{email}</p>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-semibold mb-2">
                  🔐 Verification Code
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-xl text-white placeholder-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 text-center text-2xl font-mono letter-spacing-wider"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verifying...
                    </span>
                  ) : (
                    '✅ Verify & Login'
                  )}
                </button>
                
                <button 
                  onClick={() => {
                    isView(false);
                    setOtp('');
                  }}
                  className="w-full py-3 bg-transparent border border-purple-400/30 text-purple-200 rounded-xl font-semibold hover:bg-white/5 transition-all duration-300"
                >
                  ↩️ Back to Email
                </button>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4 fade-in">
            <div className="flex justify-center space-x-4">
              <Link 
                to="/signup" 
                className="text-purple-300 hover:text-white transition-colors duration-300 font-semibold"
              >
                Don't have an account? Sign Up
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
