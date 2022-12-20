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

      if (!admin && !customer && !supplier) {
        res.status(200).json({ message: 'Username Available' })
      } else {
        res.status(400).json({ message: 'Username already exists' })
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
