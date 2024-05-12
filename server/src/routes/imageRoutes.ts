import express from 'express'
import { upload } from '../config/multer'
import { deleteImage, uploadImage } from '../controllers/imageController'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').post(isAuth, getUser, upload.single('image'), uploadImage)
router.route('/:imageUrlOrName').delete(isAuth, getUser, deleteImage)

export default router
