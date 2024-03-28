import express from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userControllers'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

export default router
