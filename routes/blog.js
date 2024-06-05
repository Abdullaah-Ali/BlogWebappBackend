const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./login');
const { parse, isValid } = require('date-fns');
const { UserProfile  } = require('./profile')

//defining the mongoose schema for the blog page 

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdat: {
        type: Date,
        default: null
    },
    blogId: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        }
    ]
});

const Blog = mongoose.model('Blog', blogSchema);

const getFirstLine = (content) => {
    const firstLine = content.split('\n')[0].trim();
    return firstLine;
};

// Function to extract the title from the first line of the content
const getTitleFromFirstLine = (content) => {
    const firstLine = getFirstLine(content);
    // Remove HTML tags
    const cleanTitle = firstLine.replace(/<\/?[^>]+(>|$)/g, '').trim();
    return cleanTitle;
};

//api name would be createblog

router.route('/')
    .post(authenticateToken, async (req, res) => {
        try {
            const { content, formattedDate, description } = req.body;

            // Retrieve the user's profile
            const userProfile = await UserProfile.findOne({ email: req.user.email });
            if (!userProfile) {
                return res.status(404).json({ message: 'User profile not found' });
            }
            
            // Parse the formatted date
            const createdDate = parse(formattedDate, 'yy/MM/dd', new Date());
            console.log('Parsed Date:', createdDate);

            if (!isValid(createdDate)) {
                console.error('Invalid date format:', formattedDate);
                throw new Error('Invalid date format');
            }

            // Get the title from the first line of the content
            const title = getTitleFromFirstLine(content);
            console.log("Title:", title);

            // Create a new blog post with comments
            const newBlogPost = new Blog({
                title: title,
                content: content,
                createdat: createdDate,
                description: description,
                blogId: new mongoose.Types.ObjectId().toString(),
                author: userProfile.name,
                comments: [] // Initialize empty comments array
            });

            // Save the new blog post
            await newBlogPost.save();

            res.status(201).json(newBlogPost);
        } catch (error) {
            console.error("Error saving blog post:", error);
            res.status(500).json({ message: 'Failed to create blog post', error: error.message });
        }
    });


   
   
        module.exports = { router,Blog }; 
