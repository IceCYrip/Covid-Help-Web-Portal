import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      if (req.body._id) {
        let orders =
          (await Customer.findById(req.body._id)) ??
          (await Supplier.findById(req.body._id))

        res.status(200).send(orders)
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
