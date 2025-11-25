const express = require('express');
const router = express.Router();
const Blog = require('../Models/BlogSchema');
const User = require('../Models/UserSchema');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');

const checkBlogOwnership = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found'});
        }

        if (blog.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Permission denied: You do not own this blog'});
        }

        req.blog = blog;
        next();
    } catch (err) {
        res.status(500).json( {message: err.message });
    }
};
router.get('/test', authTokenHandler, async (req, res)=>{
    res.json({
        message: "Test api for blogs",
        useId : req.userId
    })
})

// Create a new blog post
router.post('/', authTokenHandler, async (req, res) => {
    try {
        const { title, description, imageUrl, paragraphs, category } = req.body;
        //console.log(title, description, imageUrl, paragraphs, category )
        const blog = new Blog({ title, description,imageUrl, paragraphs, owner: req.userId, category });
        await blog.save();

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.blogs.push(blog._id);
        await user.save();

        res.status(201).json({ message: 'Blog post created successfully', blog });
    } catch (err) {
      console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Get a specific blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found"});
        }
        res.status(200).json({ message: "Blog fetched successfully"});
    } catch (err) {
        res.status(500).json(createResponse({ message: err.message }));
    }
});


// Update a specific blog post by ID
router.put('/:id', authTokenHandler, checkBlogOwnership, async (req, res)=>{
    try {
        const { title, description, imageUrl, paragraphs, category } = req.body;
        const updateBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, description, imageUrl, paragraphs, category },
            { new: true }
        );
        if (!updateBlog){
            return res.status(404).json({ message: 'Blog post not found'});
        }
         res.status(200).json({ message: 'Blog post updated successfully', updateBlog});
    } catch (err) {
        res.status(500).json( {message: err.message });
    }

});

// Delete a specific blog post by ID
router.delete('/:id', authTokenHandler, checkBlogOwnership, async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const blogIndex = user.blogs.indexOf(req.params.id);
        if (blogIndex !== -1) {
            user.blogs.splice(blogIndex, 1);
            await user.save();
        }

        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const search = req.body.search || ''; 
        const page = parseInt(req.body.page) || 1; 
        const perPage = 2; // Number of blogs per page

        const searchQuery = new RegExp(search, 'i');

        const totalBlogs = await Blog.countDocuments({ title: searchQuery });

        const totalPages = Math.ceil(totalBlogs / perPage);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({ message: 'Invalid page number'});
        }
        const skip = (page - 1) * perPage;

        const blogs = await Blog.find({ title: searchQuery })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);

        res.status(200).json({ blogs, totalPages, currentPage: page });
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});
module.exports = router;