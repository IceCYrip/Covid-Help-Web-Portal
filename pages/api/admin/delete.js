import Admin from '../../../models/Admin'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    try {
      let admin
      if (req.body._id) {
        admin = await Admin.findByIdAndDelete(req.body._id)
        res.status(200).json({ message: 'Successfully Deleted' })
      } else {
        res.status(400).json({ message: 'No parameter passed' })
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
