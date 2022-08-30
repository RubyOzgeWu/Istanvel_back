import posts from '../models/posts.js'

export const getPosts = async (req, res) => {
  try {
    const result = await posts.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const getPost = async (req, res) => {
  try {
    const result = await posts.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// admin-----------------------------------------------------------
export const getAllPosts = async (req, res) => {
  try {
    const result = await posts.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const createPost = async (req, res) => {
  try {
    const result = await posts.create({
      title: req.body.title,
      CH_title: req.body.CH_title,
      author: req.body.author,
      CH_author: req.body.CH_author,
      content: req.body.content,
      CH_content: req.body.CH_content,
      date: req.body.date,
      image: req.file?.path || '',
      category: req.body.category,
      sell: req.body.sell
    })
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

export const editPost = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      CH_title: req.body.CH_title,
      author: req.body.author,
      CH_author: req.body.CH_author,
      content: req.body.content,
      CH_content: req.body.CH_content,
      date: req.body.date,
      image: req.file?.path || '',
      category: req.body.category,
      sell: req.body.sell
    }
    if (req.file) data.image = req.file.path
    const result = await posts.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deletePost = async (req, res) => {
  try {
    await posts.findByIdAndDelete(req.params.id)
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
