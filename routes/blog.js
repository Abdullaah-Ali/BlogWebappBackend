const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./login');
const { parse, isValid } = require('date-fns');


//defining the mongoose schema for the blog page 

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdat:{
        type:Date,
        default:null
    },
    blogId:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true
    }

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
        try{
            //console.log("hey i was hit ")
            const {content,formattedDate} = req.body
            console.log(content,formattedDate)
            

            const createdDate = parse(formattedDate, 'yy/MM/dd', new Date());
            console.log('Parsed Date:', createdDate);

            if (!isValid(createdDate)) {
                console.error('Invalid date format:', formattedDate);
                throw new Error('Invalid date format');
            }

            // Get the title from the first line of the content
            const title = getTitleFromFirstLine(content);
            console.log("Title:", title);

            const newBlogPost = new Blog({
                title:title,
                content:content,
                createdat: createdDate,
                blogId: new mongoose.Types.ObjectId().toString(), // Generate a unique blogId
                email: req.user.email // Assuming email is stored in the token
            });
            await newBlogPost.save()

            res.status(201).json(newBlogPost);



        }catch(error){
            console.error("Error saving blog post:", error); // Log the error
            res.status(500).json({ message: 'Failed to create blog post', error: error.message });




            }

        });




   
   
module.exports = router;
module.exports = Blog;