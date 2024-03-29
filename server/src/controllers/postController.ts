import asyncHandler from 'express-async-handler'
import Post from '../models/postModel'

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const { userId } = req.query
    const filter = userId ? { userId: userId.toString() } : {}
    const posts = await Post.find(filter)
    res.json(posts)
})

// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    res.json(post)
})

// @desc    Create a post
// @route   POST /api/posts/
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    const { title, body } = req.body
    const goal = await Post.create({ title, body, userId: req.session.userId })
    res.status(201).json(goal)
})

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    // Make sure one cannot update other's post
    if (post.userId.toString() !== req.session.userId) {
        res.status(401)
        throw new Error('User not authorized')
    }

    post.title = req.body.title || post.title
    post.body = req.body.body || post.body

    const updatedPost = await post.save()

    res.json(updatedPost)
})

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    // Make sure one cannot update other's post
    if (post.userId.toString() !== req.session.userId) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await Post.deleteOne({ _id: req.params.id })
    res.json({ message: 'Post successfully removed' })
})
