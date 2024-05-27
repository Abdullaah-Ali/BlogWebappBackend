const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./signup');


router.route('/')

    .post(async (req, res) => {
        try {
            const { email, password } = req.body; 
            console.log(email , password)  
            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({
                email: user.email,
                name: user.name
            }, 'secret123', { expiresIn: '1h' });

            console.log(token);
             res.cookie('jwtToken', token, { 
                httpOnly: true,
                maxAge: 3600000, 
                sameSite: 'none',
                secure: true,
                domain: 'localhost',
                sameSite: 'none' ,
                path: '/'
            });
            return res.status(200).json({ message: 'User login is completed', email , redirectTo: '/' });

            

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });


//imported function for the usage of checking the token authentication everytime user access 
function authenticateToken(req, res, next) {
        const token = req.cookies.jwtToken;
    
        if (!token) {
            return res.status(401).json({ message: 'Please Login' });
        }
    
        jwt.verify(token, 'secret123', (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // Clear the JWT token cookie if it has expired
                    res.clearCookie('jwtToken');
                    return res.status(401).json({ message: 'Token expired. Please refresh your token.' });
                } else {
                    return res.status(403).json({ message: 'Forbidden: Invalid token' });
                }
            }
        
            req.user = decoded;
            next();
        });
    }
    

module.exports = { router, authenticateToken }; // Export both router and authenticateToken
