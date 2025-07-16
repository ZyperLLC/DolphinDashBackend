const mongoose = require('mongoose');

const bettingSchema = new mongoose.Schema({
  bettingRoundNo: {
    type: Number,
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  hasEnded: {
    type: Boolean,
    default: false,
  },
  hasBettingStopped:{
    type:Boolean,
    deafult:false,
  },
  winningNumber: {
    type: Number,
    required: true,
    min: 0,
    max: 36,
    default: 0
  },
  totalBets: {
    type: Number,
    required: true,
    default:0
  },
  totalAmountBetted: {
    type: Number,
    required: true,
    default:0
  },
  tonAmountBetted: {
    type: Number,
    default: 0,
  },
  creditAmountBetted: {
    type: Number,
    default: 0,
  },
  numberOfWinners: {
    type: Number,
    default: 0,
  },
  amountPaidToWinners: {
    type: Number,
    default: 0,
  },
});

const BettingRound = mongoose.model('BettingRound', bettingSchema);
module.exports = BettingRound;
