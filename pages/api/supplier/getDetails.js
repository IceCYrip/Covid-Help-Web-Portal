import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let supplier = await Supplier.findById(req.body._id)
      if (supplier) {
        res.status(200).json({
          id: supplier._id,
          compName: supplier.compname,
          suppName: supplier.suppname,
          contact: supplier.contact,
          pincode: supplier.pincode,
          area: supplier.area,
          address: supplier.address,
          uname: supplier.uname,
          upi: supplier.upi,
          mask: supplier.mask,
          oxygencylinder: supplier.oxygencylinder,
          remdevisir: supplier.remdevisir,
          orders: supplier.orders,
          usertype: 'supplier',
        })
      } else {
        res.status(400).json({ message: 'User not found' })
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
