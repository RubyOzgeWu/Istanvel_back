import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少標題']
  },
  CH_title: {
    type: String,
    required: [true, '缺少標題']
  },
  author: {
    type: String
    // required: [true, '缺少作者']
  },
  CH_author: {
    type: String
    // required: [true, '缺少作者']
  },
  content: {
    type: String,
    required: [true, '缺少內容']
  },
  CH_content: {
    type: String,
    required: [true, '缺少內容']
  },
  date: {
    type: Date,
    required: [true, '缺少日期˙']
  },
  image: {
    type: String
    // required: [true, '缺少圖片']
  },
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['History', 'Geography', 'Culture & Foods'],
      message: '文章分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('posts', schema)
