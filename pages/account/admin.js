import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import SideBar from '../../components/SideBar'

import styles from '../../styles/pages.module.css'
import Loader from '../../components/Loader'
import sweetAlert from 'sweetalert'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import { login } from '../../redux/slices/UserSlice'

const Index = () => {
  const [Loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const [reports, setReports] = useState()

  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    fullName: yup.string().required('Please enter a name.'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setRunAgain(false)

    //Get Admin Details
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/${user.usertype}/getDetails`, {
        _id: user._id,
      })
      .then((res) => {
        reset(res.data)
        dispatch(login({ ...user, fullName: res.data.fullName }))
        setLoading(false)
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
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
      })

    //Get Reports
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/admin/reports`, {
        _id: user._id,
      })
      .then((res) => {
        setReports(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
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
      })
  }, [runAgain])

  const finish = (data) => {
    const bodyForApi = {
      ...data,
      fullName: data.fullName.trim(),
      _id: user._id,
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_HOST}/api/${user.usertype}/save`,
        bodyForApi
      )
      .then((res) => {
        if (res.status === 200) {
          sweetAlert({
            title: 'Updated!',
            text: 'Record Updated successfully !',
            icon: 'success',
            buttons: {
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
      .catch((error) => {
        console.log('error: ', error)
        sweetAlert({
          title: 'ERROR!',
          text: `${error}`,
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
      })
  }

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
            <form onSubmit={handleSubmit(finish)}>
              <h1
                className={styles.TitleText}
                style={{ textTransform: 'uppercase' }}
              >
                My Account
              </h1>
              <div className={styles.row} style={{ marginTop: '5vh' }}>
                <TextField
                  sx={{ width: 300 }}
                  label="Full Name"
                  variant="standard"
                  InputLabelProps={{ shrink: !Loading }}
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors?.fullName && errors.fullName.message}
                />
                <TextField
                  sx={{ width: 300 }}
                  label="Username"
                  variant="standard"
                  disabled
                  InputLabelProps={{ shrink: !Loading }}
                  {...register('uname')}
                />
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    backgroundColor: '#F92303',
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

            <h2
              className={styles.TitleText}
              style={{ textTransform: 'uppercase', marginTop: '10vh' }}
            >
              Reports
            </h2>

            <div className={styles.row} style={{ marginTop: '5vh' }}>
              {/* User Reports */}
              <div className={styles.reportCard} style={{ width: '8vw' }}>
                <h3
                  style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginTop: 0,
                  }}
                >
                  Users: {reports?.usersReport.total}
                </h3>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Admins</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.usersReport.admins}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Customers</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.usersReport.customers}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Suppliers</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.usersReport.suppliers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Reports */}
              <div className={styles.reportCard} style={{ width: '15vw' }}>
                <h3
                  style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginTop: 0,
                  }}
                >
                  Orders: {reports?.orderReport.totalOrders}
                </h3>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Masks sold</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.orderReport.maskSold}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Oxygen Cylinders sold</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.orderReport.oxygenCylinderSold}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Remdevisirs sold</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.orderReport.remdevisirSold}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Reports */}
              <div className={styles.reportCard} style={{ width: '13.5vw' }}>
                <h3
                  style={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    marginTop: 0,
                  }}
                >
                  Stock
                </h3>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Masks</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.stockReport.maskCount}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Oxygen Cylinders</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.stockReport.oxygenCylinderCount}
                    </span>
                  </div>
                </div>
                <div
                  className={styles.row}
                  style={{
                    marginBottom: 3,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Remdevisirs</span>
                  <div>
                    <span>:</span>
                    <span style={{ marginLeft: '1.5vw', fontWeight: 'bold' }}>
                      {reports?.stockReport.remdevisirCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
