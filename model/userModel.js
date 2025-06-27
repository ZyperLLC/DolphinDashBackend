const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telegramId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    tonBalance:{
        type:Number,
        required:true,
        default:0
    },
    creditBalance:{
        type:Number,
        required:true,
        default:0
    },
    
    betsPlace:{
        type:[
            {
                betId:{
                    type:Number,
                    required:true,
                },
                amountBet:{
                    type:Number,
                    required:true
                },
                numberBettedOn:{
                    type:Number,
                    required:true
                },
                hasWon:{
                    type:Boolean,
                    required:true
                },
                amountWon:{
                    type:Number,
                    required:true
                },
                useTon:{
                    type:Boolean,
                    required:true,
                    default:false
                },
                holdingNFT:{
                    type:Boolean,
                    required:true
                }
            }
        ]
    },
    stakedNFTs:[
        {
            nftAddress:{
                type:String,
                required:true
            },
            stakedAt:{
                type:Date,
                required:true,
                default:Date.now()
            },
        friends: [
            {
                type: String,
                required: true
            }
        ],
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
