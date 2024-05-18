import asyncHandler from 'express-async-handler'
import { redis } from '../config/redis'
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX, __prod__ } from '../constants'
import { uploadImage } from '../helpers/imageHelper'
import User from '../models/userModel'
import { resetPasswordTemplate, sendEmail } from '../utils/sendEmail'
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
        avatar: user.avatar,
        bio: user.bio,
    })
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password, shouldRememberUser } = req.body
    const user = await User.findOne({ email })

    // User not found or incorrect password
    if (!user || !(await user.matchPassword(password))) {
        res.status(401)
        throw new Error('Invalid email or password')
    }

    // Store userId session in browser's cookie
    req.session.userId = user._id.toString()
    if (shouldRememberUser) {
        req.session.cookie.maxAge = 1 * 365 * 24 * 60 * 60 * 1000 // 1 year
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
    })
})

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err)

        res.clearCookie(COOKIE_NAME, {
            sameSite: __prod__ ? 'none' : 'lax',
            secure: __prod__,
        })
        res.json({ message: 'Successfully logged out' })
    })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user!

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
    })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.user!

    if (req.file) {
        const { imageUrl } = await uploadImage(req.file)
        user.avatar = imageUrl
        user.allAvatars.push(imageUrl)
    } else if (user.avatar && req.body.shouldRemoveAvatar) {
        user.avatar = null
    } else {
        user.name = req.body.name || user.name
        user.bio = req.body.bio || user.bio
        user.password = req.body.password || user.password
    }

    const updatedUser = await user.save()

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
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

    await sendEmail(
        req.body.email,
        'Password Reset Request for Bloggerum',
        resetPasswordTemplate(
            user.name,
            `${process.env.CORS_ORIGIN}/change-password/${token}`
        )
    )
    res.json({ message: 'Email sent successfully' })
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

    res.json({ message: 'Password updated successfully' })
})

// @desc    Validate password
// @route   POST /api/users/validate-password
// @access  Private
export const validatePassword = asyncHandler(async (req, res) => {
    const user = req.user!
    const { password } = req.body

    const isValid = await user.matchPassword(password)
    const statusCode = isValid ? 200 : 401

    res.status(statusCode).json({
        isValid,
    })
})

// @desc    Get an user profile
// @route   GET /api/users/profile/:id
// @access  Public
export const getUserProfileById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
    })
})
