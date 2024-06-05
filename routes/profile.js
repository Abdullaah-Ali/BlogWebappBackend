const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticateToken } = require('./login');

const userProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  occupation: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true
  }
});

// we would add the user comments in the profile schema make it false as it is not important or required for everytime 
// once the user make comments it would be save in the database and display on the same blog on which user displaye this can be done using the blogId tracking  

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

router.route('/')
  .get(authenticateToken, async (req, res) => {
    try {
      const userEmail = req.user.email;
      const userProfile = await UserProfile.findOne({ email: userEmail });
      if (!userProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  })
  .post(authenticateToken, async (req, res) => {
    try {
      const { name, email, occupation, DOB } = req.body;
      const userEmailFromToken = req.user.email;

      const existingUser = await UserProfile.findOne({ email: userEmailFromToken });
      if (existingUser) {
        const updateFields = { name, occupation, DOB };
        if (email) updateFields.email = email;

        const updatedProfile = await UserProfile.findOneAndUpdate(
          { email: userEmailFromToken },
          updateFields,
          { new: true }
        );
        return res.json(updatedProfile);
      } else {
        const newUserProfile = new UserProfile({
          name,
          email,
          occupation,
          DOB
        });
        await newUserProfile.save();
        return res.json(newUserProfile);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = { router, UserProfile };
