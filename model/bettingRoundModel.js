const mongoose = require('mongoose');

const bettingSchema = new mongoose.Schema({
    bettingRoundNo:{
        type:Number,
        requried:true,
    },
    startedAt:{
        type:Date,
        default:Date.now(),
        required:true
    },
    hasEnded:{
        type:Boolean,
        defaul:false
    },
    winningNumber:{
        type:Number,
        required:true,
        min:0,
        max:36                
    },
    totalBets: {
        type:Number,
        required:true
    },
    totalAmountBetted:{
        type:Number,
        required:true
    },
    tonAmountBetted:{
        type:Number,
        default:0
    },
    creditAmountBetted:{
        type:Number,
        default:0
    },
    numberOfWinners:{
        type:Number,
        default:0
    },
    amountPaidToWinners:{
        type:Number,
        default:0
    }
});

const BettingRound = mongoose.model('BettingRound',bettingSchema);
module.exports = BettingRound