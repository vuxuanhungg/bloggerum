import asyncHandler from 'express-async-handler'
import { COOKIE_NAME } from '../constants'
import User from '../models/userModel'

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

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
    })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.user!

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.password = req.body.password || user.password

    const updatedUser = await user.save()

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
    })
})
