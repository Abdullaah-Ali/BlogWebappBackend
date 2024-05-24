const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
const cookieParser = require('cookie-parser');


//to handle the json middleware is to be used


// Signup route - GET




//defing the user mongoose in the old db 
const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    isUserVerified:{
        type : Boolean,
        default : false
    },
    otpCreation:{
        type:Date,
        default : null},
        
        otp: { // New field to store OTP
            type: String
        },


    otpExpiresAt:{
        type:Date,
        default : null},

    createdAt:{
        type:Date, 
        default: Date.now
    }
})





//user mnodel
const User = mongoose.model('User', userSchema);


// Signup route - POST
router.post('/', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;
        console.log(name, email, password)

        // Check if passwords match
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: true });

        // Store OTP and its expiration time
        newUser.otp = otp;
        newUser.otpCreation = new Date();
        newUser.otpExpiresAt = new Date(newUser.otpCreation.getTime() + 60000); // 1 minute
        await newUser.save();

        // Send OTP via email
        await sendEmail(email, 'Your OTP verification code is', otp);

        // Set cookie with user's email (expires in 1 minute)
        res.cookie('userEmail', email, { maxAge: 60000 });

        // Redirect to OTP verification page
        return res.redirect('/signup/verify-otp');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});






router.route('/verify-otp')
    .get((req, res) => {
        // Your logic for handling GET requests
        res.sendFile(path.join(__dirname, 'template', 'otp.html'));
    })
    .post(async (req, res) => {
        try {
            const userEmail = req.cookies.userEmail; // Retrieve user's email from cookie
            const otpverification = req.body.otpverification; // Extract OTP verification code from request body
            const user = await User.findOne({ email: userEmail });

            console.log("User Email:", userEmail);
            console.log("OTP Verification Code:", otpverification);
            console.log("User OTP:", user.otp);

            if (!user || user.otpExpiresAt < new Date()) {
                // User not found or OTP expired
                // Discard registration info and redirect to signup page
                console.log("User not found or OTP expired");
                return res.redirect('/signup');
            }
    
            if (otpverification === user.otp) {
                // OTP verification successful
                // Mark user as verified and save changes
                console.log("OTP verification successful");
                user.isUserVerified = true;
                await user.save();
                return res.redirect('/login');
            } else {
                // Incorrect OTP
                console.log("Incorrect OTP");
                return res.redirect('/signup/verify-otp');
            }
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });





//mail // nodemailer

async function sendEmail(to,text,otp) {
    try {
        // Create a transporter using Gmail SMTP settings
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ahere094@gmail.com',
                pass: 'hpao tmpx hlyk jkkv'
            }
        });

        // Define email content
        let mailOptions = {
            from: 'ahere094@gmail.com',
            to: to,
            subject: "OTP VERIFICATION EMAIL",
            text: `${text} ${otp}`
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}
// Export the router
module.exports = router;


