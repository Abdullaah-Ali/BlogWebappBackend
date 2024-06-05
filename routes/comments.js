
const express = require('express');
const router = express.Router();
const { Blog } = require('./blog');   // Import the Blog model
const { authenticateToken } = require('./login');
const { UserProfile } = require('./profile');

// Get comments for a blog post
router.get('/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const blog = await Blog.findOne({ title });
     
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
  
        const comments = blog.comments; // Retrieve comments directly from the blog document
       // console.log(comments)
        res.status(200).json(comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error });
    }
  });

  router.post('/:title', authenticateToken, async (req, res) => {
    const { title } = req.params;
    const { text } = req.body;
    const userEmail = req.user.email;
    const userProfile = await UserProfile.findOne({ email: userEmail });

    const username = userProfile.name; // Assuming name is the field in UserProfile schema that contains the username

    try {
        const blog = await Blog.findOne({ title });

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const comment = {
            text: text,
            username: username
        };

        blog.comments.push(comment); // Add the comment to the blog
        await blog.save();

        res.status(201).json(blog.comments);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error });
    }
});



module.exports = router;
  