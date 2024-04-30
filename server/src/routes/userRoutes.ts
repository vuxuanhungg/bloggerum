import express from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    changePassword,
    validatePassword,
    getUserProfileById,
} from '../controllers/userController'
import { getUser, isAuth } from '../middleware/authMiddleware'
import { upload } from '../config/multer'

const router = express.Router()

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router
    .route('/profile')
    .get(isAuth, getUser, getUserProfile)
    .put(isAuth, getUser, upload.single('avatar'), updateUserProfile)
router.get('/profile/:id', getUserProfileById)
router.post('/forgot-password', forgotPassword)
router.post('/change-password', changePassword)
router.post('/validate-password', isAuth, getUser, validatePassword)

export default router
