// routes/blogview.js
const express = require('express');
const router = express.Router();
const Blog = require('./blog'); // Assuming you have a Blog model defined

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title;
    console.log("Backend route hit with title:", title);
    const blog = await Blog.findOne({ title });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
