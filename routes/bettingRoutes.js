
const express = require('express');
const bettingRouter = express.Router();

router.post('/startbet', /* controller function here */);
router.post('/endbet',);

router.get('/',); //get all bets
router.get('/getbet/:betId', /* controller function here */);

router.put('/updatebet/:betId', /* controller function here */);

router.delete('/:telegramId', /* controller function here */);

module.exports = bettingRouter;
