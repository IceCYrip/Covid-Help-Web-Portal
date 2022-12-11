import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import Order from '../../../models/Order'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let order = new Order({
        customerId: req.body.customerId,
        supplierId: req.body.supplierId,
        mask: req.body.mask,
        remdevisir: req.body.remdevisir,
        oxygencylinder: req.body.oxygencylinder,
        price: req.body.price,
      })
      let createdOrder = await order.save()
      console.log('Order: ', createdOrder)

      let supplier = await Supplier.findById(req.body.supplierId)
      supplier.orders.push({ orderID: createdOrder._id })
      await Supplier.findByIdAndUpdate(req.body.supplierId, supplier)

      let customer = await Customer.findById(req.body.customerId)
      customer.orders.push({ orderID: createdOrder._id })
      await Customer.findByIdAndUpdate(req.body.customerId, customer)

      res.status(201).json({ message: 'Order Placed' })
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
