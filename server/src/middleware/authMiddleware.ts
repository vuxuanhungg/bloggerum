import asyncHandler from 'express-async-handler'

export const protect = asyncHandler(async (req, res, next) => {
    if (!req.session.userId) {
        res.status(401)
        throw new Error('Not authorized')
    }

    next()
})
