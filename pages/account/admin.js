import React, { useEffect, useState } from 'react'

import { Button, IconButton, Paper, TextField } from '@mui/material'
import Head from 'next/head'
import SideBar from '../../components/SideBar'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { login } from '../../redux/slices/UserSlice'
import maskSVG from '../../public/images/mask.svg'
import o2SVG from '../../public/images/oxygen.svg'
import remdevisirSVG from '../../public/images/remdevisir.svg'

import styles from '../../styles/pages.module.css'
import Loader from '../../components/Loader'
import { DataGrid } from '@mui/x-data-grid'
import Image from 'next/image'
import { Delete } from '@mui/icons-material'

const index = () => {
  const [Loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const [showOrdersSection, setShowOrdersSection] = useState(false)
  const [orders, setOrders] = useState([])
  // @ts-ignore
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

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
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setRunAgain(false)

    //Get Customer Details
    axios
      .post(`http://localhost:4500/api/${user.usertype}/getDetails`, {
        _id: user._id,
      })
      .then((res) => {
        reset({ ...res.data })
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

    //Get Orders
    axios
      .post(`http://localhost:4500/api/order/getOrders`, {
        _id: user._id,
      })
      .then((res) => {
        setOrders(
          res.data.map((j, i) => ({
            id: i + 1,
            srNo: i + 1,
            _id: j._id,
            suppName: j.suppName,
            suppAddress: j.suppAddress,
            mask: j.mask,
            remdevisir: j.remdevisir,
            oxygencylinder: j.oxygencylinder,
            price: j.price,
            status: j.status,
          }))
        )
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

  const cancelOrder = (index) => {
    const bodyForApi = {
      orderId: orders[index]._id,
      status: 'cancel',
    }

    //Update Orders
    axios
      .post(`http://localhost:4500/api/order/update`, bodyForApi)
      .then((res) => {
        setLoading(false)
        sweetAlert({
          title: `${res.data.title}`,
          text: `${res.data.message}`,
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
      })
      .catch((error) => {
        console.log('error: ', error)
        setLoading(false)
        sweetAlert({
          title: 'ERROR!',
          text: `${error.response.data}`,
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

  const columns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerName: 'Sr No.',
      width: 80,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'suppName',
      headerName: 'Supplier Name',
      flex: 0.8,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'suppAddress',
      headerName: 'Supplier Address',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'mask',
      headerName: (
        <Image
          src={maskSVG}
          alt="Loader"
          priority
          height={35}
          width={35}
          style={{ marginTop: '3.5vh' }}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      width: 80,

      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'oxygencylinder',
      headerName: (
        <Image
          src={o2SVG}
          alt="Loader"
          priority
          height={48}
          width={48}
          style={{ marginTop: '3.5vh' }}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      width: 80,

      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'remdevisir',
      headerName: (
        <Image
          src={remdevisirSVG}
          alt="Loader"
          priority
          height={40}
          width={40}
          style={{ marginTop: '3.5vh' }}
        />
      ),
      headerAlign: 'center',
      align: 'center',
      width: 80,

      sortable: false,
    },

    {
      headerClassName: 'cellColor',
      field: 'price',
      headerName: 'Price',
      headerAlign: 'center',
      align: 'center',
      width: 120,

      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === 'To be Dispatched' && (
              <>
                {params.row.status}
                <IconButton
                  sx={{ color: '#F92303', marginLeft: 2 }}
                  onClick={() => cancelOrder(params.row.srNo - 1)}
                >
                  <Delete />
                </IconButton>
              </>
            )}
            {params.row.status !== 'To be Dispatched' && params.row.status}
          </>
        )
      },
    },
  ]

  const finish = (data) => {
    const bodyForApi = {
      ...data,
      _id: user._id,
    }

    axios
      .post(`http://localhost:4500/api/${user.usertype}/save`, bodyForApi)
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
              {!showOrdersSection && (
                <>
                  <h1
                    className={styles.TitleText}
                    style={{ textTransform: 'uppercase' }}
                  >
                    My Account
                  </h1>
                  <div className={styles.rowGap}>
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
                      label="Contact"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('contact')}
                      error={!!errors.contact}
                      helperText={errors?.contact && errors.contact.message}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="Address"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors?.address && errors.address.message}
                    />
                  </div>
                  <div className={styles.rowGap}>
                    <TextField
                      sx={{ width: 300 }}
                      label="Pincode"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('pincode')}
                      error={!!errors.pincode}
                      helperText={errors?.pincode && errors.pincode.message}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="Area"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('area')}
                      error={!!errors.address}
                      helperText={errors?.address && errors.address.message}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="Username"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('uname')}
                    />
                  </div>

                  <div className={styles.Button}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        backgroundColor: '#F92303',
                        marginTop: '6vh',
                        // marginBottom: '2vh',
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
                  <div className={styles.Button}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        backgroundColor: '#F92303',
                        marginTop: '2vh',
                        width: 185,
                        height: 50,
                        fontSize: 'larger',
                        borderRadius: '15px',
                      }}
                      onClick={() => {
                        setShowOrdersSection(true)
                      }}
                    >
                      MY ORDERS
                    </Button>
                  </div>
                </>
              )}
              {showOrdersSection && (
                <div
                  // className={styles.boxShadow}
                  style={{
                    padding: '0vw 1vw',
                    paddingTop: '0.1vw',
                    paddingBottom: '2vw',
                    // marginTop: '2vh',
                    borderRadius: '30px',
                  }}
                >
                  <h1
                    className={styles.TitleText}
                    style={{
                      textTransform: 'uppercase',
                      marginBottom: '5vh',
                    }}
                  >
                    Orders
                  </h1>
                  <DataGrid
                    sx={{
                      '& .cellColor': {
                        backgroundColor: '#F92303',
                        color: 'white',
                      },
                      zIndex: 0,
                    }}
                    autoHeight
                    disableSelectionOnClick
                    disableColumnMenu
                    pageSize={5}
                    rows={orders}
                    columns={columns}
                  />
                  <div className={styles.Button}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        backgroundColor: '#F92303',
                        marginTop: '5vh',
                        width: 185,
                        height: 50,
                        fontSize: 'larger',
                        borderRadius: '15px',
                      }}
                      onClick={() => {
                        setShowOrdersSection(false)
                      }}
                    >
                      GO Back
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
