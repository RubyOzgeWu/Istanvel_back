import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少活動名稱']
  },
  CH_name: {
    type: String,
    required: [true, '缺少活動名稱']
  },
  description: {
    type: String,
    required: [true, '缺少活動敘述']
  },
  CH_description: {
    type: String,
    required: [true, '缺少活動敘述']
  },
  image: {
    type: String
    // required: [true, '缺少圖片']
  },
  location: {
    type: String,
    required: [true, '缺少活動地點']
  },
  dateStart: {
    type: Date,
    required: [true, '缺少開始日期']
  },
  dateEnd: {
    type: Date
    // required: [true, '缺少結束日期']
  },
  time: {
    type: String
  },
  price: {
    type: Number,
    min: [0, '價格格式錯誤']
  },
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['Art & Design', 'Technology & Science', 'Food', 'Industry', 'Business'],
      message: '商品分類錯誤'
    }
  },
  CH_category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['藝術設計', '科技與科學', '食物', '產業', '商業'],
      message: '商品分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('activities', schema)
