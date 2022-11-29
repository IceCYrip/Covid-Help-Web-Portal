const mongoose = require('mongoose')

const SupplierSchema = new mongoose.Schema({
  compname: {
    type: String,
  },
  suppname: {
    type: String,
  },
  contact: {
    type: Number,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  upi: {
    type: String,
    required: true,
  },
  mask: {
    type: Number,
  },
  remdevisir: {
    type: Number,
  },
  oxygencylinder: {
    type: Number,
  },
  usertype: {
    type: String,
    required: true,
  },
})

mongoose.models = {}
module.exports =
  mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)
