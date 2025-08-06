import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/emergency.css';
import './styles/global.css';
import './index.css';
import './App.css';
import Home from './pages/SimpleHome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';

const App = () => (
  <div className="App">
    <Router basename="/snake-game" >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  </div>
);

export default App;
