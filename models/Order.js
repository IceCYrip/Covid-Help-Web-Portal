const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
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
})

mongoose.models = {}
module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema)
