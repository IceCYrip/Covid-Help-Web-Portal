const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  uname: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
  },
})

mongoose.models = {}
module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
