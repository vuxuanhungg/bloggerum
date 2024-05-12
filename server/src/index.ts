import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { connectDB } from './config/db'
import { redisStore } from './config/redis'
import { COOKIE_NAME, __prod__ } from './constants'
import { errorHandler, notFound } from './middleware/errorMiddleware'
import imageRoutes from './routes/imageRoutes'
import postRoutes from './routes/postRoutes'
import tagRoutes from './routes/tagRoutes'
import userRoutes from './routes/userRoutes'

const PORT = parseInt(process.env.PORT) || 8080

connectDB()

const app = express()

app.set('trust proxy', 1)
app.use(
    session({
        name: COOKIE_NAME,
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // only save session when data exists
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            sameSite: __prod__ ? 'none' : 'lax',
            secure: __prod__,
        },
    })
)

app.use(express.json())
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/images', imageRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
