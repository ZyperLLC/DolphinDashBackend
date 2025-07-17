const BettingRound = require('../models/bettingRoundModel');
const User = require('../models/userModel');

// Start a new bet
exports.startBet = async (req, res) => {
  try {
    const count = await BettingRound.countDocuments();
    const lastbet = await BettingRound.findOne({bettingRoundNo:count});
    if(lastbet && lastbet.hasEnded==false){
      res.status(500).json("Last round not ended yet");
    }
    const bettingRoundNo = count + 1;

    const bet = new BettingRound({
      ...req.body,
      bettingRoundNo,
    });

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
    const bet = await BettingRound.findOne({bettingRoundNo:betId});

    if (!bet) return res.status(404).json({ error: "Bet not found" });
    if (bet.hasEnded) return res.status(500).json({error:"Round already ended"});
    // Find all users who placed a winning bet on this round
    const users = await User.find({
      betsPlace: {
        $elemMatch: {
          betId: betId,
          numberBettedOn: winningNumber
        }
      }
    });

    let numberOfWinners = 0;
    let amountPaidToWinners = 0;

    for (const user of users) {
      let updated = false;
      for (let bet of user.betsPlace) {
        if (bet.betId === betId && bet.numberBettedOn === winningNumber && !bet.hasWon) {
          bet.hasWon = true;
          const multiplier = bet.holdingNFT ? 7.7 : 7;
          bet.amountWon = bet.amountBet * multiplier;
          amountPaidToWinners += bet.amountWon;
          updated = true;
        }
      }
      if (updated) {
        numberOfWinners++;
        await user.save();
      }
    }

    bet.numberOfWinners = numberOfWinners;
    bet.amountPaidToWinners = amountPaidToWinners;
    bet.hasEnded = true;
    bet.winningNumber = winningNumber;
    await bet.save();

    res.json({ message: "Bet ended",bet, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.stopbetting= async (req,res)=>{
  try{
    const rounds = await BettingRound.find();
  const latestRound = rounds[rounds.length-1];
  latestRound.hasBettingStopped = true;
  latestRound.save();
  res.json(latestRound);
  }catch(err){
    res.status(500).json({
      error:err
    })
  }
}
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
    const bet = await BettingRound.findOne({bettingRoundNo:req.params.betId});
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
    const bet = await BettingRound.findOneAndUpdate(
      { bettingRoundNo:req.params.betId},
      { totalBets, totalAmountBetted },
      { new: true }
    );
    res.json(bet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
