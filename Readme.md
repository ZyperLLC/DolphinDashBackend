# 🎰 Betting App API

This is a backend REST API built with **Node.js**, **Express**, and **MongoDB** for a Zyper Dolphin Dash betting platform. It handles user registrations, token/credit deposits, placing bets, ending betting rounds, staking NFTs, and inviting friends.

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Dotenv for environment config

---

## 📁 Folder Structure
├── server.js
├── .env
├── README.md
├── controllers/
│ ├── userController.js
│ └── bettingController.js
├── models/
│ ├── userModel.js
│ └── bettingRoundModel.js
├── routes/
│ ├── userRoutes.js
│ └── bettingRoutes.js



---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd betting-app

2. **Install Dependencies**
  npm install

3. **Create a .env file**

 PORT=3000
 MONGO_URI=

4. **Run the Server**
 node server.js

## 🔗  Base URL
http://localhost:3000/api


## 🧪 API Endpoints

👤 User Endpoints

| Method | Endpoint                               | Description                |
| ------ | -------------------------------------- | -------------------------- |
| POST   | `/api/users/register`                  | Register a new user        |
| POST   | `/api/users/deposit/:telegramId`       | Deposit TON or credits     |
| POST   | `/api/users/placebet/:telegramId`      | Place a bet                |
| POST   | `/api/users/stakenft/:telegramId`      | Stake an NFT               |
| POST   | `/api/users/invite/:telegramId`        | Invite a friend            |
| POST   | `/api/users/withdraw/:telegramId`      | Withdraw tokens or credits |
| GET    | `/api/users/getuser/:telegramId`       | Get user by Telegram ID    |
| GET    | `/api/users/getbetsbyuser/:telegramId` | Get all bets by the user   |
| GET    | `/api/users/getstakednfts/:telegramId` | Get all staked NFTs        |
| GET    | `/api/users/`                          | Get all users              |
| PUT    | `/api/users/:telegramId`               | Update user (stub)         |
| DELETE | `/api/users/:telegramId`               | Delete user                |


🧾 Betting Round Endpoints

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| POST   | `/api/bets/startbet`         | Start a new betting round |
| POST   | `/api/bets/endbet`           | End a betting round       |
| GET    | `/api/bets/`                 | Get all betting rounds    |
| GET    | `/api/bets/getbet/:betId`    | Get a betting round by ID |
| PUT    | `/api/bets/updatebet/:betId` | Update a betting round    |


🧾 Sample Request Bodies

🔹 Register User

POST /api/users/register
{
  "username": "betplayer1",
  "telegramId": "123456",
  "walletAddress": "0xabc123",
  "tonBalance": 100,
  "creditBalance": 200
}

🔹 Deposit to User
POST /api/users/deposit/123456
{
  "amount": 50,
  "isTon": true
}

🔹 Place a Bet
POST /api/users/placebet/123456
{
  "betId": 1,
  "amountBet": 10,
  "numberBettedOn": 12,
  "hasWon": false,
  "amountWon": 0,
  "useTon": true,
  "holdingNFT": false
}

🔹 Start Betting Round
POST /api/bets/startbet
{
  "bettingRoundNo": 1,
  "totalBets": 0,
  "totalAmountBetted": 0,
  "winningNumber": 0
}


🔹 End Betting Round

POST /api/bets/endbet
{
  "betId": "60f6...id",
  "winningNumber": 7
}


## 📅 Last Updated
June 27, 2025