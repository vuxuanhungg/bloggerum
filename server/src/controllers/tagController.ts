import asyncHandler from 'express-async-handler'
import Tag from '../models/tagModel'

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = asyncHandler(async (_req, res) => {
    const tags = await Tag.find()
    res.json(tags)
})

// @desc    Create a tag
// @route   POST /api/tags
// @access  Private
export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body
    const tag = await Tag.create({ name })
    res.status(201).json(tag)
})
