const express = require('express');
const router = express.Router();

router.post('/startbet', /* controller function here */);
router.post('/endbet', /* controller function here */);

router.get('/', /* controller function here */); // Get all bets
router.get('/getbet/:betId', /* controller function here */);

router.put('/updatebet/:betId', /* controller function here */);

router.delete('/:telegramId', /* controller function here */);

module.exports = router;
