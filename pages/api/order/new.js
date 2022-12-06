import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      //Updating Customer
      let customer = await Customer.findById(req.body.customerId)
      customer.orders.push(req.body.detailsForCustomer)
      await Customer.findByIdAndUpdate(customer._id, customer)

      //Updating Supplier
      let supplier = await Supplier.findById(req.body.supplierId)
      supplier.orders.push(req.body.detailsForSupplier)
      await Supplier.findByIdAndUpdate(supplier._id, supplier)

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
