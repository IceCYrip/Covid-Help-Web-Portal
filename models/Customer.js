const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
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
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
