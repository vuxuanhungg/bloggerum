import { NextFunction, Request, Response } from 'express'
import { CastError } from 'mongoose'
import { __prod__ } from '../constants'

// Catch-call for any routes that don't exist
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(err)
}

// Catch-all for any errors that occur in our routes
export const errorHandler = (
    err: CastError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    let { message } = err

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404
        message = 'Resource not found'
    }

    res.status(statusCode).json({
        message,
        stack: __prod__ ? null : err.stack,
    })
}
