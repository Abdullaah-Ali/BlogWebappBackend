const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;
const cors = require('cors');

const signupRouter = require('./routes/signup'); // Import the router from signup.js
const logoutRoute = require('./routes/logout');
app.use(express.json());

app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.set('strictQuery', false); // Set mongoose configuration

// Import loginRouter and authenticateToken middleware
const { router: loginRouter, authenticateToken } = require('./routes/login');

// Define routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter); // Use the signupRouter middleware
app.use('/logout', logoutRoute);

// Home route, requires authentication
app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the home page!', user: req.user });
});

// Start the server
const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://abdullahaliquadri:tiktak786@cluster0.fihugf0.mongodb.net/myclients?retryWrites=true&w=majority');
        app.listen(port, () => {
            console.log('Server has been started on port ' + port);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
