import asyncHandler from 'express-async-handler'
import User from '../models/userModel'

export const isAuth = asyncHandler(async (req, res, next) => {
    if (!req.session.userId) {
        res.status(401)
        throw new Error('Not authorized')
    }

    next()
})

export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.session.userId)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    req.user = user
    next()
})
