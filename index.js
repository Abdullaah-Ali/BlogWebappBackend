const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;
const cookieParser = require('cookie-parser');

const cors = require('cors');

const {router : signupRouter} = require('./routes/signup'); // Import the router from signup.js
const logoutRoute = require('./routes/logout');
const blogRouter = require('./routes/blogview')
const {router: blogcreateRouter} = require ('./routes/blog')
const allblogs = require('./routes/home')
const {router : profileRouter} = require('./routes/profile')
const Commentrouter  = require('./routes/comments')

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    //methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    //allowedHeaders: ['Content-Type'],
    credentials: true
  }));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.set('strictQuery', false); // Set mongoose configuration

// Import loginRouter and authenticateToken middleware
const { router: loginRouter, authenticateToken } = require('./routes/login');

// Define routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter); // Use the signupRouter middleware
app.use('/logout', logoutRoute);
app.use('/createblog', blogcreateRouter);
app.use('/blogs', blogRouter)
app.use('/', allblogs)
app.use('/profile' , profileRouter )
app.use('/comments', Commentrouter)
// Home route, requires authentication
app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the home page!', user: req.user });
}); 

// Start the server
const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://abdullahaliquadri:tiktak786@cluster0.fihugf0.mongodb.net/myclients?retryWrites=true&w=majority'); // Use environment variable for the connection string
        app.listen(port, () => {
            console.log('Server has been started on port ' + port);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

start();
