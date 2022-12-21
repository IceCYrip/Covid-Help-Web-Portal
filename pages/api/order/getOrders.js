import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import Order from '../../../models/Order'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      if (req.body._id) {
        let isCustomer = await Customer.findById(req.body._id)
        let isSupplier = await Supplier.findById(req.body._id)

        if (!isCustomer && !isSupplier) {
          res.status(400).send('Something went Wrong')
        } else {
          let orders = await Order.find()
          let filtered = [],
            response = [],
            user = {}

          if (isCustomer) {
            filtered = orders.filter((obj) => {
              return obj.customerId == req.body._id
            })
            for (let obj of filtered) {
              user = await Supplier.findById(obj.supplierId)
              response.push({
                _id: obj._id,
                fullName: user.fullName,
                address: user.address,
                mask: obj.mask,
                remdevisir: obj.remdevisir,
                oxygencylinder: obj.oxygencylinder,
                price: obj.price,
                status: obj.status,
              })
            }
          } else {
            filtered = orders.filter((obj) => {
              return obj.supplierId == req.body._id
            })

            for (let obj of filtered) {
              user = await Customer.findById(obj.customerId)
              response.push({
                _id: obj._id,
                custFullName: user.fullName,
                custAddress: user.address,
                mask: obj.mask,
                remdevisir: obj.remdevisir,
                oxygencylinder: obj.oxygencylinder,
                price: obj.price,
                status: obj.status,
              })
            }
          }
          // res.status(200).send(filtered)
          res.status(200).send(response)
        }
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
