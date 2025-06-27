
const express = require('express');
const router = express.Router();

router.post('/startbet', /* controller function here */);
router.post('/endbet',);

router.get('/',); //get all bets
router.get('/getbet/:betId', /* controller function here */);

router.put('/updatebet/:betId', /* controller function here */);

router.delete('/:telegramId', /* controller function here */);

const bettingRouter = router;
module.exports = bettingRouter;
