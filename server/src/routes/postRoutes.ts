import express from 'express'
import {
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
} from '../controllers/postController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', protect, createPost)
router.put('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)

export default router
