
const express = require('express');
const router = express.Router();
const bettingController = require('../controllers/bettingController');

router.post('/startbet', bettingController.startBet);
router.post('/endbet', bettingController.endBet);
router.post('/stopbetting',bettingController.stopbetting);

router.get('/',bettingController.getAllBets); //get all bets
router.get('/getbet/:betId', bettingController.getBetsByBetId);

router.put('/updatebet/:betId', bettingController.updateBet);

const bettingRouter = router;
module.exports = bettingRouter;
