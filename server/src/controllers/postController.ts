import { PutObjectCommand } from '@aws-sdk/client-s3'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import sharp from 'sharp'
import { getFileUrl, s3Client } from '../config/s3'
import { TEBI_BUCKET_NAME } from '../constants'
import Post from '../models/postModel'
import Tag from '../models/tagModel'
import { uuid } from '../utils'

// Mongoose does not auto cast string to ObjectId if we use `aggregate()`
const { ObjectId } = mongoose.Types

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
    const { userId, tag } = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const queryByUser = userId
        ? { userId: new ObjectId(userId.toString()) }
        : {}
    const queryByTag = tag
        ? {
              tags: tag.toString(),
          }
        : {}
    const query = { ...queryByUser, ...queryByTag }

    const result = await Post.aggregate([
        { $match: query },
        {
            $sort: { updatedAt: -1 },
        },
        {
            // $facet allows multi aggregation: "posts" and "count"
            $facet: {
                posts: [
                    {
                        // join users collection with posts
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user',
                        },
                    },
                    {
                        // prettify the result: make the "user" field an object instead of an array with one object
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
                            thumbnail: 1,
                            user: {
                                _id: 1,
                                name: 1,
                            },
                            tags: 1,
                            updatedAt: 1,
                        },
                    },
                    { $skip: skip },
                    { $limit: limit },
                ],
                count: [
                    {
                        $count: 'count',
                    },
                ],
            },
        },
        {
            $project: {
                posts: 1,
                totalPages: {
                    $ifNull: [
                        {
                            $ceil: {
                                $divide: [{ $first: '$count.count' }, limit],
                            },
                        },
                        0,
                    ],
                },
            },
        },
    ])

    // Convert thumbnail from imageName to url
    const posts = await Promise.all(
        result[0].posts.map(async (post: any) => {
            const url = await getFileUrl(post.thumbnail)
            return { ...post, thumbnail: url }
        })
    )

    res.json({
        totalPages: result[0].totalPages,
        posts,
    })
})

// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = asyncHandler(async (req, res) => {
    const result = await Post.aggregate([
        {
            $match: { _id: new ObjectId(req.params.id) },
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
                thumbnail: 1,
                user: {
                    _id: 1,
                    name: 1,
                },
                tags: 1,
                updatedAt: 1,
            },
        },
    ])

    if (result.length === 0) {
        throw new Error('Post not found')
    }

    const thumbnailUrl = await getFileUrl(result[0].thumbnail)
    res.json({ ...result[0], thumbnail: thumbnailUrl })
})

// @desc    Create a post
// @route   POST /api/posts/
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
    const { title, body }: { title: string; body: string } = req.body
    const tags: string[] = JSON.parse(req.body.tags)
    // get the file
    // resize and optimize image (sharp)
    // upload image to s3 bucket
    // store image name and any extra data to server

    if (!req.file) {
        throw new Error('Post missing thumbnail field')
    }

    const imageName = uuid()
    const imageBuffer = await sharp(req.file.buffer)
        .resize({
            width: 1024,
            height: 576,
            withoutEnlargement: true,
        })
        .webp()
        .toBuffer()

    const uploadCommand = new PutObjectCommand({
        Bucket: TEBI_BUCKET_NAME,
        Key: imageName,
        Body: imageBuffer,
        ContentType: req.file.mimetype,
    })
    await s3Client.send(uploadCommand)

    if (tags.length > 0) {
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
        thumbnail: imageName,
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
