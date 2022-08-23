import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  getTours,
  getTour,
  getAllTours,
  createTour,
  editTour,
  deleteTour
} from '../controllers/tours.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createTour)
router.get('/', getTours)
router.get('/all', auth.jwt, admin, getAllTours)
router.get('/:id', getTour)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editTour)
router.delete('/:id', auth.jwt, admin, deleteTour)

export default router
