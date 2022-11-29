import Customer from '../../../models/Customer'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let c = await Customer.findById(req.body._id)
      res.status(200).json({
        address: c.address,
        area: c.area,
        contact: c.contact,
        fullName: c.fullName,
        pincode: c.pincode,
        uname: c.uname,
      })
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
