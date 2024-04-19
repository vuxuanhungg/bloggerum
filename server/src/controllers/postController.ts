import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { deleteImage, uploadImage } from '../helpers/imageHelper'
import {
    commonPostAggregationPipelineStages,
    getPostsBySearchPipeline,
    getPostsByUserOrTagPipeline,
} from '../helpers/postHelper'
import Post from '../models/postModel'
import Tag from '../models/tagModel'

// Mongoose does not auto cast string to ObjectId if we use `aggregate()`
const { ObjectId } = mongoose.Types

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const { userId, tag } = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 14
    const skip = (page - 1) * limit

    // Query by userId or tag
    const queryByUser = userId
        ? { userId: new ObjectId(userId.toString()) }
        : {}
    const queryByTag = tag
        ? {
              tags: tag.toString(),
          }
        : {}
    const query = { ...queryByUser, ...queryByTag }

    // Query by search
    const searchQuery = req.query.q

    // Get the result
    let result
    if (searchQuery) {
        result = await Post.aggregate(
            getPostsBySearchPipeline(searchQuery as string, skip, limit)
        )
    } else {
        result = await Post.aggregate(
            getPostsByUserOrTagPipeline(query, skip, limit)
        )
    }
    res.json(result[0])
})

// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = asyncHandler(async (req, res) => {
    const result = await Post.aggregate([
        {
            $match: { _id: new ObjectId(req.params.id) },
        },
        commonPostAggregationPipelineStages.joinUsersCollection,
        commonPostAggregationPipelineStages.prettifyUserField,
        commonPostAggregationPipelineStages.singlePostProject,
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
    const {
        title,
        body,
        tags: stringifiedTags,
    }: { title: string; body: string; tags: string } = req.body
    const tags: string[] | null = stringifiedTags
        ? JSON.parse(stringifiedTags)
        : null

    if (!req.file) {
        throw new Error('Post missing thumbnail field')
    }

    const { imageUrl } = await uploadImage(req.file)

    if (tags) {
        tags.map((tag) => tag.toLowerCase()).forEach(async (tag) => {
            const tagExists = await Tag.findOne({ name: tag })
            if (!tagExists) {
                await Tag.create({ name: tag })
            }
        })
    }

    const post = await Post.create({
        title,
        body,
        thumbnail: imageUrl,
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

    const {
        title,
        body,
        tags: stringifiedTags,
    }: { title: string; body: string; tags: string } = req.body
    const tags: string[] | null = stringifiedTags
        ? JSON.parse(stringifiedTags)
        : null

    // Update title and body
    post.title = title || post.title
    post.body = body || post.body

    // Update thumbnail
    if (req.file) {
        // Delete old thumbnail
        await deleteImage(post.thumbnail)

        // Process and upload new thumbnail
        const { imageUrl } = await uploadImage(req.file)
        post.thumbnail = imageUrl
    }

    // Update tags
    if (tags) {
        tags.map((tag) => tag.toLowerCase()).forEach(async (tag) => {
            const tagExists = await Tag.findOne({ name: tag })
            if (!tagExists) {
                await Tag.create({ name: tag })
            }
        })
        post.tags = tags
    }

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

    await deleteImage(post.thumbnail)
    await Post.deleteOne({ _id: req.params.id })
    res.json({ message: 'Post successfully removed' })
})
