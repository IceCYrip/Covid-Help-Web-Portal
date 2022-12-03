const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  orders: [
    {
      suppName: {
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
})

mongoose.models = {}
module.exports =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
