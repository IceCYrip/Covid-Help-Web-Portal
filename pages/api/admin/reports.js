import Admin from '../../../models/Admin'
import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import Order from '../../../models/Order'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      if (await Admin.findById(req.body._id)) {
        let admins = await Admin.find()
        let customers = await Customer.find()
        let suppliers = await Supplier.find()
        let orders = await Order.find()

        //   let userCount = 0,
        //     customerCount = 0,
        //     supplierCount = 0,
        //   maskCount = 0,
        //   oxygenCylinderCount = 0,
        //   remdevisirCount = 0,
        //     orderCount = 0,
        //   maskSold = 0,
        //   oxygenCylinderSold = 0,
        //   remdevisirSold = 0

        let usersReport = {
            customers: 0,
            suppliers: 0,
            admins: 0,
            total: 0,
          },
          orderReport = {
            maskSold: 0,
            oxygenCylinderSold: 0,
            remdevisirSold: 0,
            totalOrders: 0,
          },
          stockReport = {
            maskCount: 0,
            oxygenCylinderCount: 0,
            remdevisirCount: 0,
          }

        //Updating userCount
        usersReport.admins = admins.length
        usersReport.customers = customers.length
        usersReport.suppliers = suppliers.length
        usersReport.total = admins.length + customers.length + suppliers.length

        //Updating orderReport
        orders.forEach((obj) => {
          orderReport.maskSold += obj.mask
          orderReport.oxygenCylinderSold += obj.oxygencylinder
          orderReport.remdevisirSold += obj.remdevisir
        })
        orders.totalOrders = orders.length

        //Updating stockReport
        suppliers.forEach((obj) => {
          stockReport.maskCount += obj.mask
          stockReport.oxygenCylinderCount += obj.oxygencylinder
          stockReport.remdevisirCount += obj.remdevisir
        })

        res.status(200).json({ usersReport, orderReport, stockReport })
      } else {
        res.status(403).send({ message: 'Forebidden Access' })
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
