
const express = require('express');
const userRouter = express.Router();

router.post('/register', /* controller function here */);
router.post('/deposit/:telegramId', );
router.post('/placebet/:telegramId',);
router.post('/stakenft/:telegramId',);
router.post('/invite/:telegramId',);
router.post('/witdhraw/:telegramId',);


router.get('/getuser/:telegramId', /* controller function here */);
router.get('/getbetsbyuser/:telegramId',);
router.get('/getstakednfts/:telegramId',);

router.put('/:telegramId', /* controller function here */);

router.delete('/:telegramId', /* controller function here */);

router.get('/', /* controller function here */);

module.exports = userRouter;
