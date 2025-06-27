const express = require('express');
const router = express.Router();
const bettingController = require('../controllers/bettingController');

// Create a new bet round
router.post('/startbet', bettingController.startBet);

// End a bet round
router.post('/endbet', bettingController.endBet);

// Get all bet rounds
router.get('/', bettingController.getAllBets);

// Get bet round by ID
router.get('/getbet/:betId', bettingController.getBetsByBetId);

// Update totalBets and totalAmount
router.put('/updatebet/:betId', bettingController.updateBet);

// Remove this unless you have a use-case
// router.delete('/:telegramId', someUserControllerFunc);

module.exports = router;
