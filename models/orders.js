import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者欄位']
  },
  order: [
    {
      tour: {
        type: mongoose.ObjectId,
        ref: 'tours'
      },
      activity: {
        type: mongoose.ObjectId,
        ref: 'activities'
      },
      name: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      },
      date: {
        type: String
      },
      quantity: {
        type: Number,
        required: [true, '缺少票數']
      }
    }
  ],
  orderInfo: [
    {
      name: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
