import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'

import {
  register,
  login,
  logout,
  extend,
  getUser,
  getUsers,
  deleteUser,
  addCart,
  getCart,
  editCart,
  addArchive,
  getArchive,
  deleteArchive,
  addOrderInfo,
  editOrderInfo,
  getOrderInfo
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/', auth.jwt, getUser)
router.get('/all', auth.jwt, admin, getUsers)
router.delete('/:id', auth.jwt, admin, deleteUser)
router.post('/cartTour', content('application/json'), auth.jwt, addCart(1))
router.post('/cartActivity', content('application/json'), auth.jwt, addCart(2))
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)
router.post('/archivePost', content('application/json'), auth.jwt, addArchive)
router.get('/archivePost', auth.jwt, getArchive)
router.patch('/archivePost', auth.jwt, deleteArchive)
router.post('/orderInfo', content('application/json'), auth.jwt, addOrderInfo)
router.patch('/orderInfo', content('application/json'), auth.jwt, editOrderInfo)
router.get('/orderInfo', auth.jwt, getOrderInfo)

export default router
