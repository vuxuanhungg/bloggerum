import express from 'express'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
} from '../controllers/postController'
import { getUser, isAuth } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').get(getPosts).post(isAuth, getUser, createPost)
router
    .route('/:id')
    .get(getPost)
    .put(isAuth, getUser, updatePost)
    .delete(isAuth, getUser, deletePost)

export default router
