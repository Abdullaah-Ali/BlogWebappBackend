const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const logoutRoute = require('./routes/logout');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);

const { router: loginRouter, authenticateToken } = require('./routes/login');

app.use('/login', loginRouter);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);

app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the home page!', user: req.user });
});

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://abdullahaliquadri:tiktak786@cluster0.fihugf0.mongodb.net/myclients?retryWrites=true&w=majority');
        app.listen(port, () => {
            console.log('Server has been started ' + port);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
