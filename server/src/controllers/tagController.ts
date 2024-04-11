import asyncHandler from 'express-async-handler'
import Tag from '../models/tagModel'

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = asyncHandler(async (_req, res) => {
    const tags = await Tag.find()
    res.json(tags.map((tag) => tag.name))
})
