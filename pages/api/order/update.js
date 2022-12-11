// import Customer from '../../../models/Customer'
// import Supplier from '../../../models/Supplier'
// import connectmongoDB from '../../../middleware/mongoose'

// const handler = async (req, res) => {
//   if (req.method === 'POST') {
//     try {
//       if (
//         req.body.customerId &&
//         req.body.supplierId &&
//         req.body.customerOrderId &&
//         req.body.supplierOrderId
//       ) {
//         //Updating Customer
//         let customer = await Customer.findById(req.body.customerId)

//         customer.orders.forEach((obj) => {
//           if (obj._id == req.body.customerOrderId) {
//             obj.status =
//               obj.status === 'To be Dispatched' ? 'Dispatched' : 'Delivered'
//           }
//         })
//         await Customer.findByIdAndUpdate(req.body.customerId, customer)

//         //Updating Supplier
//         let supplier = await Supplier.findById(req.body.supplierId)

//         supplier.orders.forEach((obj) => {
//           if (obj._id == req.body.supplierOrderId) {
//             obj.status =
//               obj.status === 'To be Dispatched' ? 'Dispatched' : 'Delivered'
//           }
//         })
//         await Supplier.findByIdAndUpdate(req.body.supplierId, supplier)

//         res.status(200).json({ message: 'Order status updated' })
//       } else {
//         res.status(400).json({ message: 'Something went wrong' })
//       }
//     } catch (error) {
//       console.error('Error: ', error.message)
//       res.status(500).send('Internal Server Error')
//     }
//   } else {
//     res.status(405).json({ message: 'Method not Allowed' })
//   }
// }

// export default connectmongoDB(handler)

import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import Order from '../../../models/Order'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      if (req.body.orderId) {
        let order = await Order.findById(req.body.orderId)
        if (!req.body.status) {
          order.status =
            order.status === 'To be Dispatched' ? 'Dispatched' : 'Delivered'
        } else {
          order.status = 'Cancelled'
        }
        await Order.findByIdAndUpdate(req.body.orderId, order)
        res.status(200).json({
          title:
            order.status == 'Dispatched'
              ? 'Dispatched'
              : order.status == 'Delivered'
              ? 'Delivered'
              : 'Cancelled',
          message: 'Order status updated',
        })
      } else {
        res.status(400).json({ message: 'Something went wrong' })
      }
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
