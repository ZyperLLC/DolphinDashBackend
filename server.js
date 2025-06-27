const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const bettingRouter = require('./routes/bettingRoutes');

const mongoURI = process.env.MONGO_URI; // Replace with your MongoDB URI
const app = express();

function connectDb(){

    mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
}

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/user',userRouter);
app.use('/bet',bettingRouter);

app.get('/', (req, res) => {
    res.send('GET request received!');
});

app.post('/', express.json(), (req, res) => {
    res.json({ message: 'POST request received!', data: req.body });
});

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server has started on port ${port}`);
    connectDb();
})