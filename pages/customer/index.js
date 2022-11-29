import React, { useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'
import Head from 'next/head'
import SideBar from '../../components/SideBar'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import axios from 'axios'
import sweetAlert from 'sweetalert'

import styles from '../../styles/pages.module.css'
import Loader from '../../components/Loader'

const index = () => {
  const [userData, setUserData] = useState({})
  const [Loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const user = useSelector((state) => state.user.user)

  const schema = yup.object().shape({
    fullName: yup.string().required('Please enter a name.'),
    contact: yup.number().required('Please enter a mobile no.'),
    address: yup.string().required('Please enter an address'),
    pincode: yup.number().required('Please enter a pincode'),
    area: yup.string().required('Please enter a area'),
  })

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setRunAgain(false)

    axios
      .post(`http://localhost:4500/api/${user.usertype}/getDetails`, {
        _id: user._id,
      })
      .then((res) => {
        reset({ ...res.data })
        setLoading(false)
      })
  }, [runAgain])

  const finish = (data) => {
    const bodyForApi = {
      ...data,
      _id: user._id,
    }

    axios
      .post(`http://localhost:4500/api/${user.usertype}/save`, bodyForApi)
      .then((res) => {
        if (res.status === 200) {
          // sweetAlert('Updated!', 'Record Updated successfully !', 'success')

          sweetAlert({
            title: 'Updated!',
            text: 'Record Updated successfully !',
            icon: 'success',
            // buttons: ['Delete'],
            buttons: {
              // cancel: {
              //   text: "Cancel",
              //   value: null,
              //   visible: false,
              //   className: "",
              //   closeModal: true,
              // },
              confirm: {
                text: 'OK',
                visible: true,
                closeModal: true,
              },
            },
            dangerMode: true,
          })

          setRunAgain(true)
        }
      })
  }

  // const deleteById = (id) =>{
  //   sweetAlert({
  //     title: 'Are you sure?',
  //     text: 'Once deleted, you will not be able to recover this record!',
  //     icon: 'warning',
  //     buttons: ['Cancel', 'Delete'],
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${URLS.BaseURL}/villageMappingWithDesignation/discardVillageMappingWithDesignation/${id}`
  //         )
  //         .then((res) => {
  //           if (res.status == 200) {
  //             sweetAlert('Deleted!', 'Record Deleted successfully !', 'success')
  //             setRunAgain(true)
  //           }
  //         })
  //     }
  //   })
  // }

  return (
    <>
      <Head>
        <title>CHWP - Account</title>
      </Head>

      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {Loading && <Loader />}
          <div className={styles.Content}>
            <h1 className={styles.TitleText}>My Account</h1>
            <form onSubmit={handleSubmit(finish)}>
              <div className={styles.row}>
                <TextField
                  sx={{ width: 300 }}
                  label="Full Name"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors?.fullName && errors.fullName.message}
                />
                <TextField
                  sx={{ width: 300 }}
                  label="Contact"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register('contact')}
                  error={!!errors.contact}
                  helperText={errors?.contact && errors.contact.message}
                />
              </div>
              <div className={styles.row}>
                <TextField
                  sx={{ width: 300 }}
                  label="Address"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors?.address && errors.address.message}
                />
                <TextField
                  sx={{ width: 300 }}
                  label="Pincode"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register('pincode')}
                  error={!!errors.pincode}
                  helperText={errors?.pincode && errors.pincode.message}
                />
              </div>

              <div className={styles.row}>
                <TextField
                  sx={{ width: 300 }}
                  label="Area"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register('area')}
                  error={!!errors.address}
                  helperText={errors?.address && errors.address.message}
                />
                <TextField
                  sx={{ width: 300 }}
                  label="Username"
                  variant="standard"
                  disabled
                  InputLabelProps={{ shrink: true }}
                  {...register('uname')}
                />
              </div>

              <div className={styles.Button}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    backgroundColor: '#F92303',
                    marginTop: '8vh',
                    width: 150,
                    height: 50,
                    fontSize: 'larger',
                    borderRadius: '15px',
                  }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
