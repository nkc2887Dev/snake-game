const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  gameDate: {
    type: Date,
    default: Date.now
  },
  gameMode: {
    type: String,
    default: 'classic',
    enum: ['classic']
  }
});

gameSchema.index({ score: -1 });
gameSchema.index({ email: 1, gameDate: -1 });

module.exports = mongoose.model('Game', gameSchema);