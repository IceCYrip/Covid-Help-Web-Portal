import Admin from '../../../models/Admin'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let admin
      if (req.body._id) {
        admin = await Admin.findByIdAndUpdate(req.body._id, req.body)
        res.status(200).json({ message: 'Successfully Updated' })
      } else {
        admin = new Admin({ ...req.body })
        await admin.save()
        res.status(201).json({ message: 'Successfully Created' })
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
