import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const SNAKE_SIZE = 20;
const FOOD_SIZE = 20;

const Game = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 200, y: 200 }]);
  const [food, setFood] = useState({ x: 100, y: 100 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [email, setEmail] = useState('');
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gameLoopRef = useRef();

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * (CANVAS_WIDTH / FOOD_SIZE)) * FOOD_SIZE;
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT / FOOD_SIZE)) * FOOD_SIZE;
    return { x, y };
  }, []);

  const checkCollision = useCallback((head) => {
    // Only check collision with snake body, not walls
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const wrapAroundBorders = useCallback((head) => {
    // Wrap around horizontally
    if (head.x < 0) {
      head.x = CANVAS_WIDTH - SNAKE_SIZE;
    } else if (head.x >= CANVAS_WIDTH) {
      head.x = 0;
    }
    
    // Wrap around vertically
    if (head.y < 0) {
      head.y = CANVAS_HEIGHT - SNAKE_SIZE;
    } else if (head.y >= CANVAS_HEIGHT) {
      head.y = 0;
    }
    
    return head;
  }, []);

  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      if (direction.x === 0 && direction.y === 0) return prevSnake;
      
      const newSnake = [...prevSnake];
      let head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
      
      // Wrap around borders instead of collision
      head = wrapAroundBorders(head);
      
      // Only check collision with snake body
      if (checkCollision(head)) {
        setGameOver(true);
        setGameRunning(false);
        if (score > 0) {
          setShowScoreForm(true);
        }
        return prevSnake;
      }
      
      newSnake.unshift(head);
      
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
        setIsEating(true);
        setTimeout(() => setIsEating(false), 300);
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, checkCollision, generateFood, score, wrapAroundBorders]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create textured grass-like background
    const grassGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grassGradient.addColorStop(0, '#2d5016');
    grassGradient.addColorStop(0.3, '#1e3a0f');
    grassGradient.addColorStop(0.7, '#2d5016');
    grassGradient.addColorStop(1, '#1a2e0d');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Add subtle static texture pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < CANVAS_WIDTH; i += 4) {
      for (let j = 0; j < CANVAS_HEIGHT; j += 4) {
        // Use position-based pattern to avoid flickering
        if ((i * j) % 17 === 0) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }
    
    // Draw subtle grid pattern like grass tiles
    ctx.strokeStyle = 'rgba(20, 40, 10, 0.3)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i <= CANVAS_WIDTH; i += SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i += SNAKE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }
    
    // Add border frame
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);
    
    // Draw snake with circular segments and realistic look
    snake.forEach((segment, index) => {
      const centerX = segment.x + SNAKE_SIZE / 2;
      const centerY = segment.y + SNAKE_SIZE / 2;
      const radius = (SNAKE_SIZE - 4) / 2;
      
      if (index === 0) {
        // Snake head - larger, brighter with eyes
        ctx.save();
        
        // Head glow effect
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        
        // Head gradient
        const headGradient = ctx.createRadialGradient(
          centerX - 3, centerY - 3, 0,
          centerX, centerY, radius + 2
        );
        headGradient.addColorStop(0, '#44ff88');
        headGradient.addColorStop(0.7, '#00ff66');
        headGradient.addColorStop(1, '#00cc44');
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Snake eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        
        // Determine eye positions based on direction
        let eyeOffsetX = 3;
        let eyeOffsetY = 3;
        if (direction.x > 0) { eyeOffsetX = 5; eyeOffsetY = 0; } // Right
        else if (direction.x < 0) { eyeOffsetX = -5; eyeOffsetY = 0; } // Left
        else if (direction.y > 0) { eyeOffsetX = 0; eyeOffsetY = 5; } // Down
        else if (direction.y < 0) { eyeOffsetX = 0; eyeOffsetY = -5; } // Up
        
        // Left eye
        ctx.beginPath();
        ctx.arc(centerX - 4 + eyeOffsetX, centerY - 2 + eyeOffsetY, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(centerX + 4 + eyeOffsetX, centerY - 2 + eyeOffsetY, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.restore();
      } else {
        // Snake body - circular segments with connecting lines
        ctx.save();
        
        // Body glow effect
        ctx.shadowColor = '#00cc66';
        ctx.shadowBlur = 8;
        
        // Body gradient - varies slightly for each segment
        const bodyGradient = ctx.createRadialGradient(
          centerX - 2, centerY - 2, 0,
          centerX, centerY, radius
        );
        
        const baseHue = 120 - (index * 2); // Slight color variation
        bodyGradient.addColorStop(0, `hsl(${baseHue}, 100%, 45%)`);
        bodyGradient.addColorStop(0.6, `hsl(${baseHue}, 100%, 35%)`);
        bodyGradient.addColorStop(1, `hsl(${baseHue}, 100%, 25%)`);
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Connect segments with lines for smoother appearance
        // But only if they are actually adjacent (not wrapped around borders)
        if (index < snake.length - 1) {
          const nextSegment = snake[index + 1];
          const nextCenterX = nextSegment.x + SNAKE_SIZE / 2;
          const nextCenterY = nextSegment.y + SNAKE_SIZE / 2;
          
          // Calculate distance between current and next segment
          const distanceX = Math.abs(centerX - nextCenterX);
          const distanceY = Math.abs(centerY - nextCenterY);
          
          // Only draw connecting line if segments are actually adjacent
          // If distance is greater than SNAKE_SIZE * 1.5, it means wrap-around occurred
          if (distanceX <= SNAKE_SIZE * 1.5 && distanceY <= SNAKE_SIZE * 1.5) {
            ctx.shadowBlur = 3;
            ctx.strokeStyle = bodyGradient;
            ctx.lineWidth = radius * 1.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(nextCenterX, nextCenterY);
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
    });
    
    // Draw food as an apple
    const foodCenterX = food.x + FOOD_SIZE / 2;
    const foodCenterY = food.y + FOOD_SIZE / 2;
    const foodRadius = (FOOD_SIZE - 2) / 2;
    
    ctx.save();
    
    // Apple glow effect
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 20;
    
    // Apple body gradient
    const appleGradient = ctx.createRadialGradient(
      foodCenterX - 3, foodCenterY - 3, 0,
      foodCenterX, foodCenterY, foodRadius
    );
    appleGradient.addColorStop(0, '#ff6666');
    appleGradient.addColorStop(0.5, '#ff3333');
    appleGradient.addColorStop(0.8, '#cc0000');
    appleGradient.addColorStop(1, '#990000');
    
    // Draw apple body
    ctx.fillStyle = appleGradient;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Apple shine
    ctx.shadowBlur = 0;
    const shineGradient = ctx.createRadialGradient(
      foodCenterX - 4, foodCenterY - 4, 0,
      foodCenterX - 4, foodCenterY - 4, 4
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = shineGradient;
    ctx.beginPath();
    ctx.arc(foodCenterX - 4, foodCenterY - 4, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Apple stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(foodCenterX - 1, foodCenterY - foodRadius - 3, 2, 4);
    
    // Apple leaf
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(foodCenterX + 2, foodCenterY - foodRadius - 1, 3, 2, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }, [snake, food, direction]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (gameRunning) {
      gameLoopRef.current = setInterval(gameLoop, 150);
    } else {
      clearInterval(gameLoopRef.current);
    }
    
    return () => clearInterval(gameLoopRef.current);
  }, [gameRunning, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: -SNAKE_SIZE });
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: SNAKE_SIZE });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction.x === 0) setDirection({ x: -SNAKE_SIZE, y: 0 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction.x === 0) setDirection({ x: SNAKE_SIZE, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  // Prevent canvas context menu and other unwanted interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const preventDrag = (e) => {
      e.preventDefault();
      return false;
    };

    canvas.addEventListener('contextmenu', preventContextMenu);
    canvas.addEventListener('dragstart', preventDrag);
    canvas.addEventListener('selectstart', preventDrag);

    return () => {
      canvas.removeEventListener('contextmenu', preventContextMenu);
      canvas.removeEventListener('dragstart', preventDrag);
      canvas.removeEventListener('selectstart', preventDrag);
    };
  }, []);

  const saveScore = async () => {
    if (!playerName.trim() || !email.trim()) {
      alert('Please enter both name and email');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/game/save-score', {
        playerName: playerName.trim(),
        email: email.trim(),
        score
      });
      setScoreSaved(true);
      setShowScoreForm(false);
      alert('Score saved successfully!');
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Error saving score. Please try again.');
    }
  };

  const startGame = () => {
    setSnake([{ x: 200, y: 200 }]);
    setFood(generateFood());
    setDirection({ x: SNAKE_SIZE, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameRunning(true);
    setGameStarted(true);
  };

  const resetGame = () => {
    setSnake([{ x: 200, y: 200 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
    setGameStarted(false);
    setShowScoreForm(false);
    setScoreSaved(false);
    setPlayerName('');
    setEmail('');
    setIsEating(false);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(88, 28, 135) 50%, rgb(30, 41, 59) 100%)',
        padding: '1rem',
        fontFamily: '"Poppins", sans-serif',
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.3),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(147,51,234,0.1)_0deg,transparent_60deg,rgba(147,51,234,0.1)_120deg,transparent_180deg,rgba(147,51,234,0.1)_240deg,transparent_300deg)]"></div>
      </div>
      
      {/* Main Game Layout Container */}
      <div 
        className="relative z-10 h-full max-w-7xl mx-auto"
        style={{
          position: 'relative',
          zIndex: 10,
          height: isMobile ? 'auto' : 'calc(100vh - 2rem)',
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1.5rem' : '2rem',
          alignItems: 'center',
          padding: isMobile ? '1rem 0' : '0'
        }}
      >
        
        {/* Left Side - Game Canvas */}
        <div 
          className="game-left-section"
          style={{
            flex: isMobile ? 'none' : '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: isMobile ? 'auto' : '100%',
            minWidth: isMobile ? '100%' : '450px',
            width: isMobile ? '100%' : 'auto',
            marginBottom: isMobile ? '2rem' : '0'
          }}
        >
          
          {/* Game Title */}
          <div 
            className="slide-in mb-6"
            style={{ marginBottom: '1.5rem', textAlign: 'center' }}
          >
            <h1 
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-2"
              style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: 'linear-gradient(to right, rgb(74, 222, 128), rgb(59, 130, 246), rgb(147, 51, 234))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}
            >
              🐍 Snake Game
            </h1>
          </div>

          {/* Score Display */}
          <div 
            className={`mb-6 ${isEating ? 'snake-eat' : ''} transition-all duration-300`}
            style={{ marginBottom: '1.5rem' }}
          >
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full px-8 py-4 shadow-lg"
              style={{
                background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(59, 130, 246))',
                borderRadius: '9999px',
                padding: '1rem 2rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
              }}
            >
              <span 
                className="text-2xl font-bold text-white drop-shadow-lg"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Score: <span 
                  className="text-yellow-300"
                  style={{ color: 'rgb(253, 224, 71)' }}
                >{score}</span>
              </span>
            </div>
          </div>

          {/* Game Canvas */}
          <div 
            className="relative"
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div 
              className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-2xl blur opacity-75"
              style={{
                position: 'absolute',
                inset: '-1rem',
                background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(59, 130, 246), rgb(34, 197, 94))',
                borderRadius: '1rem',
                filter: 'blur(8px)',
                opacity: 0.75,
                zIndex: -1
              }}
            ></div>
            <canvas 
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgb(30, 41, 59), rgb(51, 65, 85))',
                borderRadius: '0.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '2px solid rgba(147, 51, 234, 0.3)',
                userSelect: 'none',
                webkitUserSelect: 'none',
                msUserSelect: 'none',
                mozUserSelect: 'none',
                webkitTouchCallout: 'none',
                webkitTapHighlightColor: 'transparent'
              }}
            />
          </div>

        </div>

        {/* Right Side - Controls and Instructions */}
        <div 
          className="game-right-section"
          style={{
            flex: isMobile ? 'none' : '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center',
            height: isMobile ? 'auto' : '100%',
            padding: isMobile ? '1rem' : '2rem',
            minWidth: isMobile ? '100%' : '400px',
            width: isMobile ? '100%' : 'auto',
            gap: '1.5rem'
          }}
        >
          
          {/* Game Status Title */}
          <div 
            className="slide-in mb-4"
            style={{ marginBottom: '1rem', textAlign: 'center' }}
          >
            <h2 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                background: 'linear-gradient(to right, rgb(251, 191, 36), rgb(249, 115, 22), rgb(239, 68, 68))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >
              Game Controls
            </h2>
          </div>

          {/* Game Controls Section */}
          <div 
            className="game-controls-container"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            
            {/* Start Game State */}
            {!gameRunning && !gameOver && (
              <div 
                className="control-section"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid rgba(147, 51, 234, 0.2)'
                }}
              >
                {!gameStarted && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
                    <p 
                      className="text-purple-300 mb-4 text-lg"
                      style={{
                        color: 'rgb(196, 181, 253)',
                        fontSize: '1.125rem',
                        marginBottom: '1rem'
                      }}
                    >Ready to play?</p>
                  </div>
                )}
                <button 
                  onClick={startGame}
                  className="game-start-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem 3rem',
                    background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.5)',
                    width: '100%',
                    maxWidth: '300px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'linear-gradient(to right, rgb(74, 222, 128), rgb(34, 197, 94))';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))';
                  }}
                >
                  🚀 Start Game
                </button>
              </div>
            )}
          
          {gameOver && !showScoreForm && (
            <div className="game-over-bounce text-center bg-gradient-to-r from-red-900/80 to-purple-900/80 p-8 rounded-2xl backdrop-blur-sm border border-red-500/30">
              <p className="text-4xl font-bold text-red-400 mb-4 drop-shadow-lg">💀 Game Over!</p>
              <p className="text-2xl text-purple-200 mb-6">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {!scoreSaved && score > 0 && (
                  <button 
                    onClick={() => setShowScoreForm(true)}
                    className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold transition-all duration-300 hover:from-green-400 hover:to-emerald-500 hover:scale-105 shadow-lg"
                  >
                    💾 Save Score
                  </button>
                )}
                <button 
                  onClick={resetGame}
                  className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold transition-all duration-300 hover:from-blue-400 hover:to-purple-500 hover:scale-105 shadow-lg"
                >
                  🔄 Play Again
                </button>
              </div>
            </div>
          )}
          
          {/* Game Over State */}
          {gameOver && !showScoreForm && (
            <div 
              className="control-section game-over-bounce"
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💀</div>
              <p 
                className="text-red-400 mb-4"
                style={{
                  color: 'rgb(248, 113, 113)',
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}
              >Game Over!</p>
              <p 
                className="text-purple-200 mb-6"
                style={{
                  color: 'rgb(221, 214, 254)',
                  fontSize: '1.25rem',
                  marginBottom: '1.5rem'
                }}
              >Final Score: <span 
                className="text-yellow-400"
                style={{
                  color: 'rgb(251, 191, 36)',
                  fontWeight: '700'
                }}
              >{score}</span></p>
              
              <div 
                className="flex gap-4 justify-center"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                {!scoreSaved && score > 0 && (
                  <button 
                    onClick={() => setShowScoreForm(true)}
                    className="game-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.75rem 2rem',
                      background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '9999px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 25px rgba(34, 197, 94, 0.5)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.background = 'linear-gradient(to right, rgb(74, 222, 128), rgb(34, 197, 94))';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))';
                    }}
                  >
                    💾 Save Score
                  </button>
                )}
                <button 
                  onClick={resetGame}
                  className="game-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247))';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))';
                  }}
                >
                  🔄 Play Again
                </button>
              </div>
            </div>
          )}

          {/* Save Score Form */}
          {showScoreForm && (
            <div 
              className="control-section slide-in"
              style={{
                width: '100%',
                textAlign: 'center',
                background: 'rgba(34, 197, 94, 0.1)',
                backdropFilter: 'blur(15px)',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <p 
                className="text-green-400 mb-2"
                style={{
                  color: 'rgb(74, 222, 128)',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}
              >Awesome Score!</p>
              <p 
                className="text-emerald-200 mb-6"
                style={{
                  color: 'rgb(167, 243, 208)',
                  fontSize: '1.125rem',
                  marginBottom: '1.5rem'
                }}
              >Final Score: <span 
                className="text-yellow-400"
                style={{
                  color: 'rgb(251, 191, 36)',
                  fontWeight: '700'
                }}
              >{score}</span></p>
              
              <div 
                className="space-y-4"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <input
                  type="text"
                  placeholder="🙂 Your Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="email"
                  placeholder="📧 Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <div 
                  className="flex gap-4"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingTop: '1rem'
                  }}
                >
                  <button 
                    onClick={saveScore}
                    className="game-btn"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💾 Save Score
                  </button>
                  <button 
                    onClick={() => setShowScoreForm(false)}
                    className="game-btn"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(to right, rgb(75, 85, 99), rgb(55, 65, 81))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ⏭️ Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          </div>

          {/* Game Instructions */}
          <div 
            className="instructions-section fade-in"
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(147, 51, 234, 0.2)',
              marginTop: '1.5rem'
            }}
          >
            <h3 
              className="text-purple-300"
              style={{
                color: 'rgb(196, 181, 253)',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            >🎮 How to Play</h3>
            <div 
              className="instructions-list"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  color: 'rgb(221, 214, 254)',
                  fontSize: '1rem'
                }}
              >
                <span style={{ color: 'rgb(74, 222, 128)', fontSize: '1.25rem' }}>⌨️</span>
                Use arrow keys to control the snake
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  color: 'rgb(221, 214, 254)',
                  fontSize: '1rem'
                }}
              >
                <span style={{ color: 'rgb(248, 113, 113)', fontSize: '1.25rem' }}>🍎</span>
                Eat the red food to grow and score points
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  color: 'rgb(221, 214, 254)',
                  fontSize: '1rem'
                }}
              >
                <span style={{ color: 'rgb(251, 191, 36)', fontSize: '1.25rem' }}>⚡</span>
                Avoid hitting yourself - walls wrap around!
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  color: 'rgb(221, 214, 254)',
                  fontSize: '1rem'
                }}
              >
                <span style={{ color: 'rgb(59, 130, 246)', fontSize: '1.25rem' }}>🌀</span>
                Snake teleports through borders to opposite side
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div 
            className="navigation-section"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1.5rem'
            }}
          >
            <h3 
              className="text-orange-400"
              style={{
                color: 'rgb(251, 146, 60)',
                fontSize: '1.25rem',
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >🚀 Quick Navigation</h3>
            
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <Link 
                to="/leaderboard"
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(to right, rgb(251, 191, 36), rgb(249, 115, 22))',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(251, 191, 36, 0.5)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'linear-gradient(to right, rgb(253, 224, 71), rgb(251, 146, 60))';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(to right, rgb(251, 191, 36), rgb(249, 115, 22))';
                }}
              >
                🏆 View Leaderboard
              </Link>
              
              <Link 
                to="/"
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(to right, rgb(75, 85, 99), rgb(55, 65, 81))',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(75, 85, 99, 0.5)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'linear-gradient(to right, rgb(107, 114, 128), rgb(75, 85, 99))';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(to right, rgb(75, 85, 99), rgb(55, 65, 81))';
                }}
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

export default Game;