require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const bettingRouter = require('./routes/bettingRoutes');
const internalUserRouter = require('./routes/internalUserRoutes');

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
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || '["http://localhost:3000"]');

const validateApi = (req,res,next)=>{
    const apiKey = req.headers['x-api-key'];
    if(!apiKey){
        console.log("No API key provided");
        return res.status(401).json({error:'API key required'});
    }
    
    if(apiKey !== process.env.API_KEY){
        console.log("Invalid API key provided:", apiKey);
        return res.status(401).json({error:'Unauthorized'});
    }
    
    console.log("API key validated successfully");
    next();
}

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-API-Key'],
    credentials: true 
};

// CORS options for internal routes (allow from anywhere)
const internalCorsOptions = {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-API-Key'],
    credentials: true 
};

app.use(express.json());

// Routes - Different protection levels
app.use('/api/users',cors(corsOptions), userRouter); // Public routes for frontend
app.use('/api/internal/users', cors(internalCorsOptions), validateApi, internalUserRouter); // Admin only with API key, allow from anywhere
app.use('/api/bets',cors(corsOptions), bettingRouter); // Public routes for frontend

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
