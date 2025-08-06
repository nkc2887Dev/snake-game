import React from 'react';
import { Link } from 'react-router-dom';

const SimpleHome = () => {
  return (
    <div 
      className="game-container"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(88, 28, 135) 50%, rgb(30, 41, 59) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div 
        className="text-center max-w-6xl mx-auto"
        style={{ 
          position: 'relative', 
          zIndex: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          justifyContent: 'space-between',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        
        {/* Main Title Section */}
        <div style={{ flex: '0 0 auto', marginBottom: '2rem' }}>
          <h1 
            className="game-title"
            style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              background: 'linear-gradient(to right, rgb(74, 222, 128), rgb(59, 130, 246), rgb(147, 51, 234))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              marginBottom: '1rem'
            }}
          >
            🐍 MERN Snake Game
          </h1>
          <div 
            className="text-xl text-purple-300 font-medium"
            style={{ 
              fontSize: '1.5rem',
              color: 'rgb(196, 181, 253)',
              marginBottom: '1rem'
            }}
          >
            The Ultimate Classic Arcade Experience
          </div>
          <p 
            className="text-lg text-purple-200"
            style={{ 
              fontSize: '1.125rem',
              color: 'rgb(221, 214, 254)',
              lineHeight: '1.5',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Relive the nostalgia! Play the timeless Snake game and compete for high scores! 🎮✨
          </p>
        </div>

        {/* Main Content Section */}
        <div 
          style={{ 
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '2rem'
          }}
        >
          
          {/* Combined Features and Action Buttons */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              width: '100%',
              maxWidth: '900px'
            }}
          >
            
            {/* Play Game Card */}
            <div 
              className="card"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
              <h3 
                className="text-xl font-bold text-green-400"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'rgb(74, 222, 128)',
                  marginBottom: '1rem'
                }}
              >Classic Gameplay</h3>
              <p 
                className="text-purple-200"
                style={{
                  color: 'rgb(221, 214, 254)',
                  marginBottom: '1.5rem',
                  fontSize: '1rem'
                }}
              >Experience authentic Snake with modern graphics and smooth animations</p>
              <Link 
                to="/game" 
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(34, 197, 94, 0.5)',
                  width: '100%'
                }}
              >
                🐍 Play Snake Game
              </Link>
            </div>

            {/* Leaderboard Card */}
            <div 
              className="card"
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
              <h3 
                className="text-xl font-bold text-yellow-400"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'rgb(251, 191, 36)',
                  marginBottom: '1rem'
                }}
              >Global Leaderboard</h3>
              <p 
                className="text-purple-200"
                style={{
                  color: 'rgb(221, 214, 254)',
                  marginBottom: '1.5rem',
                  fontSize: '1rem'
                }}
              >Compete with players worldwide and climb to the top of the rankings</p>
              <Link 
                to="/leaderboard" 
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(to right, rgb(251, 191, 36), rgb(249, 115, 22))',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(251, 191, 36, 0.5)',
                  width: '100%'
                }}
              >
                🏆 View Leaderboard
              </Link>
            </div>

          </div>

          {/* Compact Game Features */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div 
                className="text-3xl font-bold text-green-400"
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'rgb(74, 222, 128)',
                  marginBottom: '0.5rem'
                }}
              >∞</div>
              <div 
                className="text-purple-200"
                style={{
                  color: 'rgb(221, 214, 254)',
                  fontSize: '0.875rem'
                }}
              >Endless Fun</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div 
                className="text-3xl font-bold text-blue-500"
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'rgb(59, 130, 246)',
                  marginBottom: '0.5rem'
                }}
              >⚡</div>
              <div 
                className="text-purple-200"
                style={{
                  color: 'rgb(221, 214, 254)',
                  fontSize: '0.875rem'
                }}
              >Smooth Gameplay</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div 
                className="text-3xl font-bold text-yellow-400"
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'rgb(251, 191, 36)',
                  marginBottom: '0.5rem'
                }}
              >🎯</div>
              <div 
                className="text-purple-200"
                style={{
                  color: 'rgb(221, 214, 254)',
                  fontSize: '0.875rem'
                }}
              >Score Tracking</div>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div 
          className="text-center"
          style={{ 
            flex: '0 0 auto',
            color: 'rgb(196, 181, 253)', 
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Made with 💜 using the MERN Stack
        </div>

      </div>
    </div>
  );
};

export default SimpleHome;