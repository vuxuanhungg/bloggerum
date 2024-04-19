import express from 'express'
import { upload } from '../config/multer'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
} from '../controllers/postController'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()

router
    .route('/')
    .get(getPosts)
    .post(isAuth, getUser, upload.single('thumbnail'), createPost)
router
    .route('/:id')
    .get(getPost)
    .put(isAuth, getUser, upload.single('thumbnail'), updatePost)
    .delete(isAuth, getUser, deletePost)

export default router
