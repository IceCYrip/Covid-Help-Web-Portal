const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
})

mongoose.models = {}
module.exports =
  mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema)
