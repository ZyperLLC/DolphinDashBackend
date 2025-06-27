const BettingRound = require('../models/bettingRoundModel');

// Start a new bet
exports.startBet = async (req, res) => {
  try {
    const bet = new BettingRound(req.body);
    await bet.save();
    res.status(201).json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End a bet (set hasEnded and winningNumber)
exports.endBet = async (req, res) => {
  try {
    const { betId, winningNumber } = req.body;
    const bet = await BettingRound.findById(betId);

    if (!bet) return res.status(404).json({ error: "Bet not found" });

    bet.hasEnded = true;
    bet.winningNumber = winningNumber;
    await bet.save();

    res.json({ message: "Bet ended", bet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bets
exports.getAllBets = async (_req, res) => {
  try {
    const bets = await BettingRound.find();
    res.json(bets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single bet
exports.getBetsByBetId = async (req, res) => {
  try {
    const bet = await BettingRound.findById(req.params.betId);
    if (!bet) return res.status(404).json({ error: "Bet not found" });
    res.json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update totalBets and totalAmountBetted
exports.updateBet = async (req, res) => {
  try {
    const { totalBets, totalAmountBetted } = req.body;
    const bet = await BettingRound.findByIdAndUpdate(
      req.params.betId,
      { totalBets, totalAmountBetted },
      { new: true }
    );
    res.json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
