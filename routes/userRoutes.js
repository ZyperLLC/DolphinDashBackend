
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/deposit/:telegramId', userController.depositTo);
router.post('/placebet/:telegramId', userController.placeBet);
router.post('/stakenft/:telegramId', userController.stakeNFT);
router.post('/invite/:telegramId',userController.inviteFriend);
router.post('/withdraw/:telegramId',userController.withdraw);
router.post('/sendcredits',userController.sendCredits);


router.get('/getuser/:telegramId', userController.getUser);
router.get('/getbetsbyuser/:telegramId',userController.getBetsByUser);
router.get('/getstakednfts/:telegramId',userController.getStakedNFTs);

router.put('/:telegramId', userController.updateUser);

router.delete('/:telegramId', userController.deleteUser);

router.get('/', userController.getAllUsers);

const userRouter = router;
module.exports = userRouter;
