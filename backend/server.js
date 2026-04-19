require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
const app = express();

connectDB();

//  Middleware
app.use(express.json()); 
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Routes
app.use('/api/users', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/message', require('./routes/message'));
app.use('/api/change', require('./routes/change')); 

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});