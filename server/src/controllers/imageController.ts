import asyncHandler from 'express-async-handler'
import {
    deleteImage as deleteHelper,
    uploadImage as uploadHelper,
} from '../helpers/imageHelper'

// @desc    Upload image
// @route   POST /api/images
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
    const { imageUrl } = await uploadHelper(
        req.file!,
        JSON.parse(req.body.resize)
    )
    res.status(201).json({ imageUrl })
})

// @desc    Remove image
// @route   DELETE /api/images/:imageUrlOrName
// @access  Private
export const deleteImage = asyncHandler(async (req, res) => {
    await deleteHelper(req.params.imageUrlOrName)
    res.json({ message: 'Image successfully removed' })
})
