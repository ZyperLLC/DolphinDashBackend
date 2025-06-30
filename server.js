require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const bettingRouter = require('./routes/bettingRoutes');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // stop app on db failure
    }
}

// Middleware
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/bets', bettingRouter);

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to zyper Dolphin Dash Betting API');
});

app.post('/', (req, res) => {
    res.json({ message: 'POST request received!', data: req.body });
});

// Start server after DB connection
connectDb().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
});
