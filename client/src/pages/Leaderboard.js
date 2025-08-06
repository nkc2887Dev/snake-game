import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/game/leaderboard?limit=20');
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mb-4"></div>
          <div className="text-2xl text-purple-300 font-semibold">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(88, 28, 135) 50%, rgb(30, 41, 59) 100%)',
        padding: '2rem 0',
        fontFamily: '"Poppins", sans-serif',
        width: '100%'
      }}
    >
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(147,51,234,0.1)_0deg,transparent_60deg,rgba(147,51,234,0.1)_120deg,transparent_180deg,rgba(147,51,234,0.1)_240deg,transparent_300deg)]"></div>
      </div>

      <div 
        className="relative z-10 max-w-6xl mx-auto px-4"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <div 
          className="text-center mb-12 slide-in"
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <h1 
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 drop-shadow-2xl"
            style={{
              fontSize: '3.75rem',
              fontWeight: '900',
              background: 'linear-gradient(to right, rgb(251, 191, 36), rgb(249, 115, 22), rgb(239, 68, 68))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            🏆 Leaderboard
          </h1>
          <p 
            className="text-xl text-purple-200"
            style={{
              fontSize: '1.25rem',
              color: 'rgb(221, 214, 254)',
              textAlign: 'center'
            }}
          >Hall of Fame - Top Snake Game Champions</p>
        </div>

        <div 
          className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-400/20 fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px)',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid rgba(147, 51, 234, 0.2)'
          }}
        >
          {error ? (
            <div 
              className="p-12 text-center"
              style={{
                padding: '3rem',
                textAlign: 'center'
              }}
            >
              <div 
                className="text-6xl mb-6"
                style={{
                  fontSize: '3.75rem',
                  marginBottom: '1.5rem'
                }}
              >😞</div>
              <p 
                className="text-2xl text-red-400 mb-6"
                style={{
                  fontSize: '1.5rem',
                  color: 'rgb(248, 113, 113)',
                  marginBottom: '1.5rem'
                }}
              >{error}</p>
              <button 
                onClick={fetchLeaderboard}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold hover:from-blue-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)'
                }}
              >
                🔄 Try Again
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div 
              className="p-12 text-center"
              style={{
                padding: '3rem',
                textAlign: 'center'
              }}
            >
              <div 
                className="text-8xl mb-8"
                style={{
                  fontSize: '5rem',
                  marginBottom: '2rem'
                }}
              >🎮</div>
              <p 
                className="text-2xl text-purple-200 mb-8"
                style={{
                  fontSize: '1.5rem',
                  color: 'rgb(221, 214, 254)',
                  marginBottom: '2rem'
                }}
              >No high scores yet!</p>
              <p 
                className="text-lg text-purple-300 mb-8"
                style={{
                  fontSize: '1.125rem',
                  color: 'rgb(196, 181, 253)',
                  marginBottom: '2rem'
                }}
              >Be the first champion to claim the throne!</p>
              <Link 
                to="/game"
                className="inline-block px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xl font-bold hover:from-green-400 hover:to-emerald-500 transition-all duration-300 hover:scale-110 shadow-2xl"
                style={{
                  display: 'inline-block',
                  padding: '1rem 3rem',
                  background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.5)'
                }}
              >
                🐍 Start Playing
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 px-8 py-6 border-b border-purple-400/20">
                <div className="grid grid-cols-4 gap-6 text-lg font-bold text-purple-200 uppercase">
                  <div className="flex items-center gap-2">
                    <span>🏆</span> Rank
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span> Player
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⚡</span> Score
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span> Date
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-purple-400/10">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`px-8 py-6 hover:bg-white/5 transition-all duration-300 ${
                      entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-6 items-center">
                      <div className={`text-2xl font-bold ${
                        entry.rank === 1 ? 'text-yellow-400' : 
                        entry.rank === 2 ? 'text-gray-300' : 
                        entry.rank === 3 ? 'text-orange-400' : 'text-purple-300'
                      }`}>
                        {getRankDisplay(entry.rank)}
                      </div>
                      <div className="font-bold text-white text-lg">
                        {entry.playerName}
                        {entry.rank <= 3 && <span className="ml-2">👑</span>}
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-purple-300">
                        {formatDate(entry.gameDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div 
          className="mt-12 text-center space-y-4 fade-in"
          style={{
            marginTop: '3rem',
            textAlign: 'center'
          }}
        >
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Link 
              to="/game"
              className="group px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-xl font-bold hover:from-red-400 hover:to-pink-500 transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-red-500/50"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2.5rem',
                background: 'linear-gradient(to right, rgb(239, 68, 68), rgb(219, 39, 119))',
                color: 'white',
                borderRadius: '9999px',
                fontSize: '1.25rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.5)'
              }}
            >
              <span 
                className="flex items-center justify-center gap-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                🐍 Play Snake Game
              </span>
            </Link>
            <Link 
              to="/"
              className="group px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full text-xl font-bold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 hover:scale-110 shadow-2xl"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2.5rem',
                background: 'linear-gradient(to right, rgb(75, 85, 99), rgb(55, 65, 81))',
                color: 'white',
                borderRadius: '9999px',
                fontSize: '1.25rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 25px 50px -12px rgba(75, 85, 99, 0.5)'
              }}
            >
              <span 
                className="flex items-center justify-center gap-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                🏠 Back to Home
              </span>
            </Link>
          </div>
          
          {leaderboard.length > 0 && (
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20">
              <h3 className="text-xl font-bold text-purple-300 mb-4">🎯 Challenge the Champions!</h3>
              <p className="text-purple-200">Think you can beat the current high score? Jump into the game and prove your skills!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;