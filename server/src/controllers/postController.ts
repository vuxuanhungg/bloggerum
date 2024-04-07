import asyncHandler from 'express-async-handler'
import Post from '../models/postModel'
import mongoose from 'mongoose'

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const { userId, tag } = req.query
    const filterByUser = userId ? { userId: userId.toString() } : {}
    const filterByTag = tag ? { tags: tag.toString() } : {}
    const filters = { ...filterByUser, ...filterByTag }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const posts = await Post.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: 'desc' })
    // FIXME: duplicate query
    const count = await Post.find(filters).countDocuments()
    res.json({ posts, totalPages: Math.ceil(count / limit) })
})

// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = asyncHandler(async (req, res) => {
    const result = await Post.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $addFields: {
                user: {
                    $first: '$user',
                },
            },
        },
        {
            $project: {
                title: 1,
                body: 1,
                user: {
                    _id: 1,
                    name: 1,
                },
                updatedAt: 1,
            },
        },
    ])

    if (result.length === 0) {
        throw new Error('Post not found')
    }

    res.json(result[0])
})

// @desc    Create a post
// @route   POST /api/posts/
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    const { title, body, tags } = req.body
    const post = await Post.create({
        title,
        body,
        userId: req.session.userId,
        tags,
    })
    res.status(201).json(post)
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
    post.tags = req.body.tags || post.tags

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
