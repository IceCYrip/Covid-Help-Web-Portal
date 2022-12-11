import Admin from '../../../models/Admin'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      let admin = await Admin.findById(req.body._id)
      if (admin) {
        res.status(200).json({
          fullName: admin.fullName,
          uname: admin.uname,
          userType: 'admin',
        })
      } else {
        res.status(400).send('Something went Wrong')
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
