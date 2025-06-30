const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Deposit TON or credits
router.post('/deposit/:telegramId', userController.depositTo);

// Place a bet
router.post('/placebet/:telegramId', userController.placeBet);

// Stake NFT (stub - create this function if needed)
router.post('/stakenft/:telegramId', (req, res) => {
  res.send("Stake NFT - to be implemented");
});

// Invite friend (stub - create this function if needed)
router.post('/invite/:telegramId', (req, res) => {
  res.send("Invite Friend - to be implemented");
});

// Withdraw funds
router.post('/withdraw/:telegramId', userController.withdraw);

// Get a single user
router.get('/getuser/:telegramId', userController.getUser);

// Get user's bets
router.get('/getbetsbyuser/:telegramId', userController.getBetsByUser);

// Get staked NFTs (stub - needs to be implemented)
router.get('/getstakednfts/:telegramId', (req, res) => {
  res.send("Get staked NFTs - to be implemented");
});

// Update user info (generic PUT)
router.put('/:telegramId', (req, res) => {
  res.send("Update user - to be implemented");
});

// Delete a user
router.delete('/:telegramId', (req, res) => {
  res.send("Delete user - to be implemented");
});

// Get all users
router.get('/', (req, res) => {
  res.send("Get all users - to be implemented");
});

module.exports = router;
