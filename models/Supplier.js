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
  orders: [
    {
      customerName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      mask: {
        type: Number,
        required: true,
        default: 1,
      },
      remdevisir: {
        type: Number,
        required: true,
        default: 1,
      },
      oxygencylinder: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: 'To be Dispatched',
      },
    },
  ],
})

mongoose.models = {}
module.exports =
  mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)
