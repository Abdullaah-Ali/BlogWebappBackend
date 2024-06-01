const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./signup');
const Blog = require('./blog.js')

//make this route to the / 
router.get('/', async (req, res) => {
try{
    
    const blogs = await Blog.find({}, 'title description');
    res.json(blogs)
}
catch(error){
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
})
module.exports = router