import activities from '../models/activities.js'

export const getActivities = async (req, res) => {
  try {
    const result = await activities.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const getActivity = async (req, res) => {
  try {
    const result = await activities.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// admin------------------------------------------------------------
export const createActivity = async (req, res) => {
  try {
    const result = await activities.create({
      name: req.body.name,
      CH_name: req.body.CH_name,
      description: req.body.description,
      CH_description: req.body.CH_description,
      image: req.file?.path || '',
      location: req.body.location,
      dateStart: new Date(req.body.dateStart),
      dateEnd: new Date(req.body.dateEnd),
      time: req.body.time,
      price: req.body.price,
      category: req.body.category,
      CH_category: req.body.CH_category,
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

export const getAllActivities = async (req, res) => {
  try {
    const result = await activities.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const editActivity = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      CH_name: req.body.CH_name,
      description: req.body.description,
      CH_description: req.body.CH_description,
      image: req.file?.path || '',
      location: req.body.location,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      time: req.body.time,
      price: req.body.price,
      category: req.body.category,
      CH_category: req.body.CH_category,
      sell: req.body.sell
    }
    if (req.file) data.image = req.file.path
    const result = await activities.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deleteActivity = async (req, res) => {
  try {
    await activities.findByIdAndDelete(req.params.id)
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
