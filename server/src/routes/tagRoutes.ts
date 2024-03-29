import express from 'express'
import { createTag, getTags } from '../controllers/tagController'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getTags).post(isAuth, getUser, createTag)

export default router
