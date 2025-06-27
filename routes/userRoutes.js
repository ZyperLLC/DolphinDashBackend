const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

// Register a new user
userRouter.post('/register', userController.registerUser);

// Deposit TON or credits
userRouter.post('/deposit/:telegramId', userController.depositTo);

// Place a bet
userRouter.post('/placebet/:telegramId', userController.placeBet);

// Stake NFT (stub - create this function if needed)
userRouter.post('/stakenft/:telegramId', (req, res) => {
  res.send("Stake NFT - to be implemented");
});

// Invite friend (stub - create this function if needed)
userRouter.post('/invite/:telegramId', (req, res) => {
  res.send("Invite Friend - to be implemented");
});

// Withdraw funds
userRouter.post('/withdraw/:telegramId', userController.withdraw);

// Get a single user
userRouter.get('/getuser/:telegramId', userController.getUser);

// Get user's bets
userRouter.get('/getbetsbyuser/:telegramId', userController.getBetsByUser);

// Get staked NFTs (stub - needs to be implemented)
userRouter.get('/getstakednfts/:telegramId', (req, res) => {
  res.send("Get staked NFTs - to be implemented");
});

// Update user info (generic PUT)
userRouter.put('/:telegramId', (req, res) => {
  res.send("Update user - to be implemented");
});

// Delete a user
userRouter.delete('/:telegramId', (req, res) => {
  res.send("Delete user - to be implemented");
});

// Get all users
userRouter.get('/', (req, res) => {
  res.send("Get all users - to be implemented");
});

module.exports = userRouter;
