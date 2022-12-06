import Customer from '../../../models/Customer'
import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'
import { gridColumnsTotalWidthSelector } from '@mui/x-data-grid'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      //Updating Customer
      let customer = await Customer.findById(req.body.customerId)
      console.log('Fetched Customers: ', customer)

      res.status(200).json({ message: 'Order status updated' })
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
