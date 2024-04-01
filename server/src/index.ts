import RedisStore from 'connect-redis'
import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { createClient } from 'redis'
import { connectDB } from './config/db'
import { COOKIE_NAME, REDIS_PREFIX, __prod__ } from './constants'
import { errorHandler, notFound } from './middleware/errorMiddleware'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import tagRoutes from './routes/tagRoutes'

const PORT = process.env.PORT || 8080

connectDB()

const app = express()

// Initialize client
const redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: REDIS_PREFIX,
    disableTouch: true,
})

// Initialize session storage
app.use(
    session({
        name: COOKIE_NAME,
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // only save session when data exists
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__,
        },
    })
)

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/tags', tagRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
