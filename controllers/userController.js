const BettingRound = require('../models/bettingRoundModel');
const User = require('../models/userModel');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deposit to user's TON or credit balance
exports.depositTo = async (req, res) => {
  try {
    const { amount, isTon } = req.body;
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (isTon) user.tonBalance += amount;
    else user.creditBalance += amount;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Place a bet
exports.placeBet = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const {
      betId, amountBet, numberBettedOn,
      hasWon, amountWon, useTon, holdingNFT
    } = req.body;
    
    const round = await BettingRound.findOne({
      bettingRoundNo:betId
    });

    if(round.hasEnded){
      res.json({error:"Round closed"});
    }

    if (useTon && user.tonBalance < amountBet) {
      return res.status(400).json({ error: 'Insufficient TON balance' });
    }

    if (!useTon && user.creditBalance < amountBet) {
      return res.status(400).json({ error: 'Insufficient credit balance' });
    }

    // Deduct balance
    if (useTon){
      user.tonBalance -= amountBet;
      round.tonAmountBetted += amountBet;  
    }
    else{
       user.creditBalance -= amountBet;
       round.creditAmountBetted += amountBet;
    }
    round.totalAmountBetted += amountBet;
    round.totalBets++;

    // Add bet
    user.betsPlace.push({
      betId, amountBet, numberBettedOn, hasWon, amountWon, useTon, holdingNFT
    });

    await user.save();
    await round.save();

    res.json({user,round});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stake NFT (stub logic)
exports.stakeNFT = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { nftAddress } = req.body;
    user.stakedNFTs.push({ nftAddress });

    await user.save();
    res.json({ message: "NFT staked successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Invite friend (stub logic)
exports.inviteFriend = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { friendUsername } = req.body;
    if (!friendUsername) return res.status(400).json({ error: "Friend username is required" });

    if (user.friends.includes(friendUsername)) {
      return res.status(400).json({ error: "Friend already invited" });
    }

    user.friends.push(friendUsername);
    user.creditBalance += 0.01;

    await user.save();
    res.json({ message: "Friend invited", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Withdraw (TON only)
exports.withdraw = async (req, res) => {
  try {
    const { amount, isTon } = req.body;
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!isTon) {
      return res.status(400).json({ error: "Only TON withdrawals are allowed" });
    }

    if (user.tonBalance < amount) {
      return res.status(400).json({ error: "Insufficient TON balance" });
    }

    user.tonBalance -= amount;
    await user.save();

    res.json({ message: "Withdraw successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bets by user
exports.getBetsByUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.betsPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get staked NFTs
exports.getStakedNFTs = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.stakedNFTs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user (stub)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ telegramId: req.params.telegramId });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendCredits = async(req,res)=>{
  try{
    const users = await User.find({
      betsPlace: {
        $elemMatch: {
          hasWon: true,
          useTon: false
        }
      }
    });
    let updatedUser = [];
    for (const user of users) {
      let totalToAdd = 0;
  
      for (const bet of user.betsPlace) {
        if (bet.hasWon && !bet.useTon) {
          totalToAdd += bet.amountWon || 0;
        }
      }
  
      if (totalToAdd > 0) {
        user.creditBalance = (user.creditBalance || 0) + totalToAdd;
        updatedUser.push(user);
        await user.save();
      }
    }
    res.status(201).json({users:updatedUser});
  }catch(err){
    res.status(500).json({error:err.message});
  }
}