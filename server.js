const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('GET request received!');
});

app.post('/', express.json(), (req, res) => {
    res.json({ message: 'POST request received!', data: req.body });
});

app.listen(3000,()=>{
    console.log('server has started on port 3000');
})