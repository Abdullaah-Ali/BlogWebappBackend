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
router.get('/', (req, res) => {
    // Your logic for handling GET requests

    res.sendFile(path.join(__dirname, 'template', 'signup.html'));
});



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
router.post('/', async  (req, res) => {
//simple registration for the user on the webpage deatils would be extracted from the request body

try { 

    const{name ,email , password,confirm_password  } = req.body
    let existingUser = await User.findOne({ email });

    console.log("Existing User:", existingUser);

    if (existingUser) {
        console.log("User already exists");
        // Check if OTP has expired and user is not verified
        if (existingUser.otpExpiresAt && existingUser.otpExpiresAt < new Date() && !existingUser.isUserVerified) {
            // Delete expired user
            console.log("Deleting expired user");
            await User.findByIdAndDelete(existingUser._id);
        } else {
            // Return error response if user is verified or OTP has not expired
            console.log("User is already verified or OTP has not expired");
            if (existingUser.isUserVerified) {
                return res.status(400).json({ message: 'User with this email is already verified' });
            } else {
                return res.status(400).json({ message: 'OTP for this user has not expired yet' });
            }
        }
    }

    console.log("Proceeding with registration");

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }



    const newUser = new User ({name , email , password}) 
    await newUser.save()
    

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: true, specialChars: true });
    
    const otpCreation = new Date();
    const otpExpiresAt = new Date(otpCreation.getTime() + 60000); // 1 minute

    newUser.otp = otp; // Store OTP in user object
    newUser.otpCreation = otpCreation;
    newUser.otpExpiresAt = otpExpiresAt;

    await newUser.save();

    await sendEmail(email, 'Your OTP verification code is',  otp); // Replace '123456' with the actual OTP


    
    res.cookie('userEmail', email, { maxAge: 60000 }); // Set cookie with user's email (expires in 1 minute)
    return res.redirect('/signup/verify-otp');



    }
catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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

module.exports = router;
module.exports = User;

