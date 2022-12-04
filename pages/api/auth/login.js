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
        res.status(200).json({
          login: false,
          message: 'Bad Credentials',
        })
      } else {
        if (customer) {
          if (customer.password === req.body.pwd) {
            res.status(200).json({
              login: true,
              _id: customer._id,
              fullName: customer.fullName,
              usertype: 'customer',
            })
          } else {
            res.status(200).json({ login: false, message: 'Bad Credentials' })
          }
        }

        if (supplier) {
          if (supplier.password === req.body.pwd) {
            res.status(200).json({
              login: true,
              _id: supplier._id,
              fullName: supplier.suppname,
              usertype: 'supplier',
            })
          } else {
            res.status(200).json({ login: false, message: 'Bad Credentials' })
          }
        }
        if (admin) {
          if (admin.password === req.body.pwd) {
            res.status(200).json({
              login: true,
              _id: admin._id,
              fullName: 'admin',
              uname: admin.uname,
              usertype: 'admin',
            })
          } else {
            // res.status(200).json({ message: 'Bad Credentials' })
            res.status(200).send('Bad Credentials')
          }
        }
      }
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ login: false, message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
