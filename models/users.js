import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '缺少帳號欄位'],
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號必須 20 個字以下'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  email: {
    type: String,
    required: [true, '缺少信箱欄位'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: true
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [
      {
        tour: {
          type: mongoose.ObjectId,
          ref: 'tours'
          // required: [true, '缺少商品欄位']
        },
        activity: {
          type: mongoose.ObjectId,
          ref: 'activities'
          // required: [true, '缺少商品欄位']
        },
        // name: {
        //   type: String
        //   required: [true, '缺少訂購人姓名']
        // },
        // email: {
        //   type: String
        //   required: [true, '缺少訂購人信箱'],
        //   validate: {
        //     validator (email) {
        //       return validator.isEmail(email)
        //     },
        //     message: '信箱格式錯誤'
        //   }
        // },
        // phone: {
        //   type: String
        //   required: [true, '缺少訂購人電話']
        // },
        date: {
          type: String
        },
        quantity: {
          type: Number,
          required: [true, '缺少票數']
        }
        // message: {
        //   type: String
        // }
      }
    ]
  },
  orderInfo: {
    type: [
      {
        name: {
          type: String
          // required: [true, '缺少訂購人姓名']
        },
        email: {
          type: String,
          // required: [true, '缺少訂購人信箱'],
          validate: {
            validator (email) {
              return validator.isEmail(email)
            },
            message: '信箱格式錯誤'
          }
        },
        phone: {
          type: String
          // required: [true, '缺少訂購人電話']
        }
      }
    ]
  },
  archivePost: {
    type: [
      {
        post: {
          type: mongoose.ObjectId,
          ref: 'posts'
        }
      }
    ]
  },
  role: {
    // 0 = 使用者
    // 1 = 管理員
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('users', schema)
