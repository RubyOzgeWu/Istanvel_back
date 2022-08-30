import users from '../models/users.js'
import orders from '../models/orders.js'

export const createOrder = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      return res.status(400).send({ success: false, message: 'Cart is empty' })
    }
    let result = await users.findById(req.user._id, 'cart').populate('cart.tour').populate('cart.activity')
    // const canCheckout = result.cart.every(item => item.product.sell)
    // if (!canCheckout) {
    //   return res.status(400).send({ success: false, message: '包含下架商品' })
    // }
    result = await orders.create({ user: req.user._id, order: req.user.cart, orderInfo: req.user.orderInfo })
    req.user.cart = []
    req.user.orderInfo = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('order.tour').populate('order.activity')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    // .populate('user', 'account')
    // 自動抓 user 欄位對應的 ref 資料，只取 account 欄位
    const result = await orders.find().populate('order.tour').populate('order.activity').populate('user', 'account')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
