import Admin from '../../../models/Admin'
import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let admin = await Admin.findOne({ uname: req.body.uname })
      let customer = await Customer.findOne({ uname: req.body.uname })
      let supplier = await Supplier.findOne({ uname: req.body.uname })

      if (!customer && !admin && !supplier) {
        res.status(400).json({ message: 'Bad Credentials' })
      } else {
        if (customer) {
          if (customer.password === req.body.pwd) {
            res.status(200).json({
              _id: customer._id,
              fullName: customer.fullName,
              usertype: customer.usertype,
              // uname: customer.uname,
              // contact: customer.contact,
              // pincode: customer.pincode,
              // area: customer.area,
              // address: customer.address,
            })
          } else {
            res.status(400).json({ message: 'Bad Credentials' })
          }
        }

        if (supplier) {
          if (supplier.password === req.body.pwd) {
            res.status(200).json({
              _id: supplier._id,
              fullName: supplier.suppname,
              usertype: supplier.usertype,
              // uname: supplier.uname,
              // compname: supplier.compname,
              // contact: supplier.contact,
              // pincode: supplier.pincode,
              // area: supplier.area,
              // address: supplier.address,
              // upi: supplier.upi,
              // mask: supplier.mask,
              // remdevisir: supplier.remdevisir,
              // oxygencylinder: supplier.oxygencylinder,
            })
          } else {
            res.status(400).json({ message: 'Bad Credentials' })
          }
        }
        if (admin) {
          if (isAdmin.password === req.body.pwd) {
            res.status(200).json({
              _id: admin._id,
              uname: admin.uname,
              usertype: admin.usertype,
            })
          } else {
            res.status(400).json({ message: 'Bad Credentials' })
          }
        }
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
