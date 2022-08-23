import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少行程名稱']
  },
  CH_name: {
    type: String,
    required: [true, '缺少行程名稱']
  },
  description: {
    type: String,
    required: [true, '缺少行程敘述']
  },
  CH_description: {
    type: String,
    required: [true, '缺少行程敘述']
  },
  departureLocation: {
    type: String
  },
  departureTime: {
    type: String
  },
  included: {
    type: String
  },
  CH_included: {
    type: String
  },
  notIncluded: {
    type: String
  },
  CH_notIncluded: {
    type: String
  },
  note: {
    type: String
  },
  CH_note: {
    type: String
  },
  image: {
    type: String
    // required: [true, '缺少圖片']
  },
  price: {
    type: Number,
    min: [0, '價格格式錯誤'],
    required: [true, '缺少價格欄位']
  },
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['History & Culture', 'Nature', 'sacred religion', 'shopping', 'cruisine'],
      message: '商品分類錯誤'
    }
  },
  CH_category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['歷史文化', '自然', '宗教', '購物', '美食'],
      message: '商品分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('tours', schema)
