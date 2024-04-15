import { PutObjectCommand } from '@aws-sdk/client-s3'
import asyncHandler from 'express-async-handler'
import sharp from 'sharp'
import { redis } from '../config/redis'
import { getFileUrl, s3Client } from '../config/s3'
import {
    COOKIE_NAME,
    FORGOT_PASSWORD_PREFIX,
    TEBI_BUCKET_NAME,
} from '../constants'
import User from '../models/userModel'
import sendEmail from '../utils/sendEmail'
import uuid from '../utils/uuid'

// @desc    Register user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({ name, email, password })

    // Store userId session in browser's cookie
    req.session.userId = user._id.toString()

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // User not found or incorrect password
    if (!user || !(await user.matchPassword(password))) {
        res.status(401)
        throw new Error('Invalid email or password')
    }

    // Store userId session in browser's cookie
    req.session.userId = user._id.toString()

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)

        res.clearCookie(COOKIE_NAME)
        res.json({ message: 'Successfully logged out' })
    })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user!

    // WARN: Currently, need to get URl for user avatar
    // on every getUser request
    let avatarUrl = null
    if (user.avatar) {
        avatarUrl = await getFileUrl(user.avatar)
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: avatarUrl,
    })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.user!

    let avatarUrl = null
    if (user.avatar) {
        avatarUrl = await getFileUrl(user.avatar)
    }

    if (req.file) {
        const imageName = uuid()
        const imageBuffer = await sharp(req.file.buffer)
            .resize({
                width: 256,
                height: 256,
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

        user.avatar = imageName
        user.allAvatars.push(imageName)
        avatarUrl = await getFileUrl(imageName)
    } else if (user.avatar && req.body.shouldRemoveAvatar) {
        // WARNING: Need a better way to keep user.avatar and avatarUrl in sync
        user.avatar = null
        avatarUrl = null
    } else {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.password = req.body.password || user.password
    }

    const updatedUser = await user.save()

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: avatarUrl,
    })
})

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    const token = uuid()
    await redis.set(
        FORGOT_PASSWORD_PREFIX + token,
        user._id.toString(),
        'EX',
        3 * 24 * 60 * 60 * 1000 // 3 days
    )

    const messageUrl = await sendEmail(
        req.body.email,
        'Reset Password',
        `<a href="http://localhost:3000/change-password/${token}">Reset password</a>`
    )
    res.send({ messageUrl })
})

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Public
export const changePassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token)
    if (!userId) {
        res.status(401)
        throw new Error('Token expired')
    }

    const user = await User.findById(userId)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    user.password = password
    await user.save()

    // Log user in after change password
    req.session.userId = user._id.toString()

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})
