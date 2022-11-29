import Doctor from '../../../models/Doctor'
import connectmongoDB from '../../../middleware/mongoose'

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      let doctor
      if (req.body._id) {
        doctor = await Doctor.findByIdAndUpdate(req.body._id, req.body)
        res.status(200).json({ message: 'Successfully Updated' })
      } else {
        doctor = new Doctor({ ...req.body })
        await doctor.save()
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
