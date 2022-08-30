import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import tours from '../models/tours.js'
import activities from '../models/activities.js'
import posts from '../models/posts.js'
// import { ReturnDocument } from 'mongodb'
// import tours from '../models/tours.js'

// register-------------------------------------------------------------------------------------------
export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  // bcrypt 加密
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: 'The account has already existed.' })
    } else {
      res.status(500).send({ success: false, message: 'errpr' })
    }
  }
}

// login-----------------------------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        // cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// logput-----------------------------------------------------------------------------------------------
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// extend ----------------------------------------------------------------------------------------------
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// getuser-------------------------------------------------------------------------------------------------
export const getUser = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        // cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// getUsers------------------------------------------------------------------------------------
export const getUsers = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// deleteUser--------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// addCart--------------------------------------------------------------------------
export const addCart = (num) => {
  return async (req, res) => {
    try {
      let result
      // 判斷是 tour 還是 activity
      if (num === 1) {
        result = await tours.findById(req.body.tour)
        // 沒找到或已下架
        if (!result || !result.sell) {
          return res.status(404).send({ success: false, message: 'Product was gone' })
        }
        // 找購物車有沒有這個商品
        const idx = req.user.cart.findIndex(item => item.tour?.toString() === req.body.tour)
        if (idx > -1) {
          req.user.cart[idx].quantity += req.body.quantity
        } else {
          req.user.cart.push({
            tour: req.body.tour,
            // name: req.body.name,
            // email: req.body.email,
            // phone: req.body.phone,
            quantity: req.body.quantity
            // message: req.body.message
          })
        }
      }

      if (num === 2) {
        result = await activities.findById(req.body.activity)
        // 沒找到或已下架
        if (!result || !result.sell) {
          return res.status(404).send({ success: false, message: 'Activity was gone' })
        }
        // 找購物車有沒有這個商品
        const idx = req.user.cart.findIndex(item => item.activity?.toString() === req.body.activity)
        if (idx > -1) {
          req.user.cart[idx].quantity += req.body.quantity
        } else {
          req.user.cart.push({
            activity: req.body.activity,
            // name: req.body.name,
            // email: req.body.email,
            // phone: req.body.phone,
            quantity: req.body.quantity
            // message: req.body.message
          })
        }
      }

      await req.user.save()
      res.status(200).send({ success: true, message: '', result: req.user.cart.length })
    } catch (error) {
      if (error.name === 'ValidationError') {
        const key = Object.keys(error.errors)[0]
        const message = error.errors[key].message
        return res.status(400).send({ success: false, message })
      } else {
        res.status(500).send({ success: false, message: 'error' })
      }
    }
  }
}

// getCart---------------------------------------------------------------------------------------
export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.tour').populate('cart.activity')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// editCart-----------------------------------------------------------------------------------------------
export const editCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      if (req.body.tour) {
        await users.findOneAndUpdate(
          { _id: req.user._id, 'cart.tour': req.body.tour },
          {
            $pull: {
              cart: { tour: req.body.tour }
            }
          }
        )
      } else if (req.body.activity) {
        await users.findOneAndUpdate(
          { _id: req.user._id, 'cart.activity': req.body.activity },
          {
            $pull: {
              cart: { activity: req.body.activity }
            }
          }
        )
      }

      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart.splice(idx, 1)
      // await req.user.save()
    } else {
      if (req.body.tour) {
        await users.findOneAndUpdate(
          { _id: req.user._id, 'cart.tour': req.body.tour },
          {
            $set: {
            // $ 代表符合陣列搜尋條件的索引
              'cart.$.quantity': req.body.quantity

            }
          }
        )
      } else if (req.body.activity) {
        await users.findOneAndUpdate(
          { _id: req.user._id, 'cart.activity': req.body.activity },
          {
            $set: {
            // $ 代表符合陣列搜尋條件的索引
              'cart.$.quantity': req.body.quantity

            }
          }
        )
      }

      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart[idx].quantity = req.body.quantity
      // await req.user.save()
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: 'error' })
    }
  }
}

// addArchive----------------------------------------------------------
export const addArchive = async (req, res) => {
  try {
    // 驗證商品
    const result = await posts.findById(req.body.post)
    // 沒找到或已下架
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: 'Post was gone' })
    }
    // 找購物車有沒有這個商品
    const idx = req.user.archivePost.findIndex(item => item.post.toString() === req.body.post)
    if (idx === -1) {
      req.user.archivePost.push({
        post: req.body.post
      })
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.archivePost.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: 'error' })
    }
  }
}
// getArchive---------------------------------------------------------------------------------------
export const getArchive = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'archivePost').populate('archivePost.post')
    res.status(200).send({ success: true, message: '', result: result.archivePost })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
// deleteArchive-------------------------------------------------------------------------------------
export const deleteArchive = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id, 'archivePost.post': req.body.post },
      {
        $pull: {
          archivePost: { post: req.body.post }
        }
      }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: 'error' })
    }
  }
}
// addOrderInfo-------------------------------------------------------
export const addOrderInfo = async (req, res) => {
  try {
    req.user.orderInfo.push({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    })
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.orderInfo.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: 'error' })
    }
  }
}

// getOrderInfo-------------------------------------------------------
export const getOrderInfo = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'orderInfo')
    res.status(200).send({ success: true, message: '', result: result.orderInfo })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
// editOrderInfo-----------------------------------------------------------
export const editOrderInfo = async (req, res) => {
  try {
    const result = await users.findOneAndUpdate(
      { _id: req.user._id, 'orderInfo._id': req.body._id },
      {
        // $set: {
        //   // $ 代表符合陣列搜尋條件的索引
        //   'orderInfo.$.name': req.body.name,
        //   'orderInfo.$.email': req.body.email,
        //   'orderInfo.$.phone': req.body.phone
        // }
        'orderInfo.$.name': req.body.name,
        'orderInfo.$.email': req.body.email,
        'orderInfo.$.phone': req.body.phone
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: 'error' })
    }
  }
}
