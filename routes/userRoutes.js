
const express = require('express');
const router = express.Router();

router.post('/register', /* controller function here */);
router.post('/deposit/:telegramId', );
router.post('/placebet/:telegramId',);
router.post('/stakenft/:telegramId',);
router.post('/invite/:telegramId',);
router.post('/withdraw/:telegramId',);


router.get('/getuser/:telegramId', /* controller function here */);
router.get('/getbetsbyuser/:telegramId',);
router.get('/getstakednfts/:telegramId',);

router.put('/:telegramId', /* controller function here */);

router.delete('/:telegramId', /* controller function here */);

router.get('/', /* controller function here */);

const userRouter = router;
module.exports = userRouter;
