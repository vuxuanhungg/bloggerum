import express from 'express'
import multer from 'multer'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
} from '../controllers/postController'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router
    .route('/')
    .get(getPosts)
    .post(isAuth, getUser, upload.single('thumbnail'), createPost)
router
    .route('/:id')
    .get(getPost)
    .put(isAuth, getUser, updatePost)
    .delete(isAuth, getUser, deletePost)

export default router
