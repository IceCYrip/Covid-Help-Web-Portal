import Supplier from '../../../models/Supplier'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let suppliers = await Supplier.find()

      let finalSort = suppliers.filter((obj) => {
        return (
          obj.area === req.body.area &&
          obj.mask >= req.body.mask &&
          obj.remdevisir >= req.body.remdevisir &&
          obj.oxygencylinder >= req.body.oxygencylinder
        )
      })

      res.status(200).json(finalSort)
    } catch (error) {
      console.error('Error: ', error.message)
      res.status(500).send('Internal Server Error')
    }
  } else {
    res.status(405).json({ message: 'Method not Allowed' })
  }
}

export default connectmongoDB(handler)
