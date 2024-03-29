import express from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userControllers'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router
    .route('/profile')
    .get(isAuth, getUser, getUserProfile)
    .put(isAuth, getUser, updateUserProfile)

export default router
