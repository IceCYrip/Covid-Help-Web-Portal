import swal from 'sweetalert'

const validator = (data) => {
  if (!data.uname.includes('.') || !data.uname.includes('@')) {
    swal({
      title: 'Incorrect E-mail',
      text: 'Please enter a valid e-mail',
      icon: 'error',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else if (
    data.password
      .toLowerCase()
      .includes(data.fullName.toLowerCase().split(' ')[0]) ||
    data.password
      .toLowerCase()
      .includes(data.fullName.toLowerCase().split(' ')[1])
  ) {
    swal({
      title: 'Easy Password',
      text: 'Password cannot include name',
      icon: 'warning',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else if (data.password !== data.confirmPassword) {
    swal({
      title: 'Incorrect Password',
      text: 'Passwords do not match. Please re-enter password',
      icon: 'error',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else if (data.upi ? !data.upi.includes('@') : false) {
    swal({
      title: 'Invalid UPI id',
      text: 'Please enter a valid UPI id',
      icon: 'error',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else if (data.contact.toString().length !== 10) {
    swal({
      title: 'Invalid Contact Number',
      text: 'Please enter a valid contact number',
      icon: 'error',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else if (data.pincode.toString().length !== 6) {
    swal({
      title: 'Invalid Pincode',
      text: 'Please enter a valid pincode',
      icon: 'error',
      buttons: {
        confirm: {
          text: 'OK',
          visible: true,
          closeModal: true,
        },
      },
      dangerMode: true,
    })
  } else {
    return true
  }
}

export default validator
