import tours from '../models/tours.js'

export const getTours = async (req, res) => {
  try {
    const result = await tours.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const getTour = async (req, res) => {
  try {
    const result = await tours.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

// admin-----------------------------------------------------------
export const getAllTours = async (req, res) => {
  try {
    const result = await tours.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}

export const createTour = async (req, res) => {
  console.log(req.body)
  try {
    const result = await tours.create({
      name: req.body.name,
      CH_name: req.body.CH_name,
      description: req.body.description,
      CH_description: req.body.CH_description,
      departureLocation: req.body.departureLocation,
      departureTime: req.body.departureTime,
      included: req.body.included,
      CH_included: req.body.CH_included,
      notIncluded: req.body.notIncluded,
      CH_notIncluded: req.body.CH_notIncluded,
      note: req.body.note,
      CH_note: req.body.CH_note,
      image: req.file?.path || '',
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

export const editTour = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      CH_name: req.body.CH_name,
      description: req.body.description,
      CH_description: req.body.CH_description,
      departureLocation: req.body.departureLocation,
      departureTime: req.body.departureTime,
      included: req.body.included,
      CH_included: req.body.CH_included,
      notIncluded: req.body.notIncluded,
      CH_notIncluded: req.body.CH_notIncluded,
      note: req.body.note,
      CH_note: req.body.CH_note,
      image: req.file?.path || '',
      price: req.body.price,
      category: req.body.category,
      CH_category: req.body.CH_category,
      sell: req.body.sell
    }
    if (req.file) data.image = req.file.path
    const result = await tours.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deleteTour = async (req, res) => {
  try {
    await tours.findByIdAndDelete(req.params.id)
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: 'error' })
  }
}
