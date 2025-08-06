const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

router.post('/save-score', async (req, res) => {
  try {
    const { playerName, email, score } = req.body;
    
    if (!playerName || !email || score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const game = new Game({
      playerName,
      email,
      score: parseInt(score)
    });
    
    await game.save();
    
    res.status(201).json({
      message: 'Score saved successfully',
      game: {
        id: game._id,
        score: game.score,
        playerName: game.playerName,
        gameDate: game.gameDate
      }
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Error saving score' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topScores = await Game.find()
      .sort({ score: -1 })
      .limit(limit)
      .select('playerName score gameDate')
      .exec();
    
    res.json({
      leaderboard: topScores.map((game, index) => ({
        rank: index + 1,
        playerName: game.playerName,
        score: game.score,
        gameDate: game.gameDate
      }))
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

router.get('/player-scores/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const playerScores = await Game.find({ email })
      .sort({ gameDate: -1 })
      .limit(limit)
      .select('score gameDate')
      .exec();
    
    const bestScore = await Game.findOne({ email })
      .sort({ score: -1 })
      .select('score')
      .exec();
    
    res.json({
      playerScores,
      bestScore: bestScore ? bestScore.score : 0,
      totalGames: playerScores.length
    });
  } catch (error) {
    console.error('Error fetching player scores:', error);
    res.status(500).json({ message: 'Error fetching player scores' });
  }
});

module.exports = router;