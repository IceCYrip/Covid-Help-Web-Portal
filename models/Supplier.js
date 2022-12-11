const mongoose = require('mongoose')

const SupplierSchema = new mongoose.Schema({
  compName: {
    type: String,
  },

  fullName: {
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
  mask: {
    type: Number,
  },
  remdevisir: {
    type: Number,
  },
  oxygencylinder: {
    type: Number,
  },
  upi: {
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
  orders: [
    {
      orderID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
})

mongoose.models = {}
module.exports =
  mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)
