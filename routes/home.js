const express = require('express');
const router = express.Router();
const { Blog } = require('./blog');  // Ensure Blog model is correctly imported

// Fetch all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}, 'title content createdat description author'); // Assuming 'content' includes description
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
