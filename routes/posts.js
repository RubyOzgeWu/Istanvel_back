import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  getPosts,
  getPost,
  getAllPosts,
  createPost,
  editPost,
  deletePost
} from '../controllers/posts.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createPost)
router.get('/', getPosts)
router.get('/all', auth.jwt, admin, getAllPosts)
router.get('/:id', getPost)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editPost)
router.delete('/:id', auth.jwt, admin, deletePost)

export default router
