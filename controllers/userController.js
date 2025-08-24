const BettingRound = require('../models/bettingRoundModel');
const User = require('../models/userModel');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log('Error in registerUser:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Deposit to user's TON or credit balance
exports.depositTo = async (req, res) => {
  try {
    const { amount, isTon } = req.body;
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) {
      console.log('Error in depositTo: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    if (isTon) user.tonBalance += amount;
    else user.creditBalance += amount;

    await user.save();
    res.json(user);
  } catch (err) {
    console.log('Error in depositTo:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Place a bet
exports.placeBet = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in placeBet: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    const {
      betId, amountBet, numberBettedOn,
      hasWon, amountWon, useTon, holdingNFT
    } = req.body;
    
    const round = await BettingRound.findOne({
      bettingRoundNo:betId
    });

    if(round.hasEnded){
      console.log('Error in placeBet: Round closed for betId:', betId);
      res.json({error:"Round closed"});
    }

    if (useTon && user.tonBalance < amountBet) {
      console.log('Error in placeBet: Insufficient TON balance. User:', req.params.telegramId, 'Required:', amountBet, 'Available:', user.tonBalance);
      return res.status(400).json({ error: 'Insufficient TON balance' });
    }

    if (!useTon && user.creditBalance < amountBet) {
      console.log('Error in placeBet: Insufficient credit balance. User:', req.params.telegramId, 'Required:', amountBet, 'Available:', user.creditBalance);
      return res.status(400).json({ error: 'Insufficient credit balance' });
    }

    // Check credit bet limit (only for credit bets)
    if (!useTon) {
      // Initialize creditBets if it doesn't exist
      if (!user.creditBets) {
        user.creditBets = {
          roundId: betId,
          numberOfBets: 0
        };
      }
      
      // Check if this is a new round
      if (user.creditBets.roundId !== betId) {
        user.creditBets.roundId = betId;
        user.creditBets.numberOfBets = 0;
      }
      
      // Check if user has reached the 10 credit bet limit for this round
      if (user.creditBets.numberOfBets >= 10) {
        console.log('Error in placeBet: Credit bet limit reached. User:', req.params.telegramId, 'Round:', betId, 'Current bets:', user.creditBets.numberOfBets);
        return res.status(400).json({ 
          error: 'Credit bet limit reached for this round. You can only place 10 credit bets per round. Use TON for additional bets.' 
        });
      }
    }

    // Deduct balance
    if (useTon){
      user.tonBalance -= amountBet;
      round.tonAmountBetted += (amountBet/1000000000);  
    }
    else{
       user.creditBalance -= amountBet;
       user.creditBets.numberOfBets += 1;
       round.creditAmountBetted += amountBet;
    }
    round.totalAmountBetted += useTon? (amountBet/1000000000):amountBet;
    round.totalBets++;

    // Add bet
    user.betsPlace.push({
      betId, amountBet, numberBettedOn, hasWon, amountWon, useTon, holdingNFT
    });

    await user.save();
    await round.save();

    res.json({user,round});
  } catch (err) {
    console.log('Error in placeBet:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Stake NFT (stub logic)
exports.stakeNFT = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in stakeNFT: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    const { nftAddress } = req.body;
    user.stakedNFTs.push({ nftAddress });

    await user.save();
    res.json({ message: "NFT staked successfully", user });
  } catch (err) {
    console.log('Error in stakeNFT:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Invite friend (stub logic)
exports.inviteFriend = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in inviteFriend: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    const { friendUsername } = req.body;
    if (!friendUsername) {
      console.log('Error in inviteFriend: Friend username is required');
      return res.status(400).json({ error: "Friend username is required" });
    }

    if (user.friends.includes(friendUsername)) {
      console.log('Error in inviteFriend: Friend already invited. User:', req.params.telegramId, 'Friend:', friendUsername);
      return res.status(400).json({ error: "Friend already invited" });
    }

    user.friends.push(friendUsername);
    user.creditBalance += 0.01;

    await user.save();
    res.json({ message: "Friend invited", user });
  } catch (err) {
    console.log('Error in inviteFriend:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Withdraw (TON only)
exports.withdraw = async (req, res) => {
  try {
    const { amount, isTon } = req.body;
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) {
      console.log('Error in withdraw: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    if (!isTon) {
      console.log('Error in withdraw: Only TON withdrawals are allowed. User:', req.params.telegramId);
      return res.status(400).json({ error: "Only TON withdrawals are allowed" });
    }

    if (user.tonBalance < amount) {
      console.log('Error in withdraw: Insufficient TON balance. User:', req.params.telegramId, 'Required:', amount, 'Available:', user.tonBalance);
      return res.status(400).json({ error: "Insufficient TON balance" });
    }

    user.tonBalance -= amount;
    await user.save();

    res.json({ message: "Withdraw successful", user });
  } catch (err) {
    console.log('Error in withdraw:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// Get single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in getUser: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log('Error in getUser:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log('Error in getAllUsers:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all bets by user
exports.getBetsByUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in getBetsByUser: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.betsPlace);
  } catch (err) {
    console.log('Error in getBetsByUser:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get staked NFTs
exports.getStakedNFTs = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('Error in getStakedNFTs: User not found for telegramId:', req.params.telegramId);
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.stakedNFTs);
  } catch (err) {
    console.log('Error in getStakedNFTs:', err.message);
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
    console.log('Error in updateUser:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ telegramId: req.params.telegramId });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.log('Error in deleteUser:', err.message);
    res.status(500).json({ error: err.message });
  }
};
