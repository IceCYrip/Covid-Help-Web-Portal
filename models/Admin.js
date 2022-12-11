const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

mongoose.models = {}
module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
