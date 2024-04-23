import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { REDIS_PREFIX } from '../constants'

// Initialize client
export const redis = new Redis(process.env.REDIS_URL)

// Initialize store
export const redisStore = new RedisStore({
    client: redis,
    prefix: REDIS_PREFIX,
    disableTouch: true,
})
