import React, { useEffect, useState } from 'react'

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material'
import Head from 'next/head'
import SideBar from '../../components/SideBar'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
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

const Index = () => {
  const [Loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const [showOrdersSection, setShowOrdersSection] = useState(false)
  const [orders, setOrders] = useState([])
  const [userDetails, setUserDetails] = useState({})
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
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setRunAgain(false)

    if (user) {
      //Get Supplier Details
      axios
        .post(
          `${process.env.NEXT_PUBLIC_HOST}/api/${user.usertype}/getDetails`,
          {
            _id: user._id,
          }
        )
        .then((res) => {
          reset({ ...res.data })
          dispatch(login({ ...user, fullName: res.data.fullName }))
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
        .post(`${process.env.NEXT_PUBLIC_HOST}/api/order/getOrders`, {
          _id: user._id,
        })
        .then((res) => {
          setOrders(
            res.data.map((j, i) => ({
              id: i + 1,
              srNo: i + 1,
              _id: j._id,
              fullName: j.custFullName,
              address: j.custAddress,
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
    } else {
      sweetAlert({
        title: 'Login Not Found!',
        text: 'Please Login to place an order',
        icon: 'warning',
        buttons: {
          confirm: {
            text: 'OK',
            visible: true,
            closeModal: true,
          },
        },
        dangerMode: true,
      }).then(() => {
        router.push('/login')
      })
    }
  }, [runAgain])

  const updateOrderStatus = (id) => {
    setLoading(true)

    //Update Orders
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/order/update`, {
        orderId: id,
      })
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
      field: 'fullName',
      headerName: 'Customer Name',
      flex: 0.8,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'address',
      headerName: 'Customer Address',
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
            {params.row.status !== 'Delivered' &&
              params.row.status !== 'Cancelled' && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    backgroundColor: '#F92303',
                    width: 120,
                    borderRadius: '15px',
                  }}
                  onClick={() => updateOrderStatus(params.row._id)}
                >
                  {params.row.status === 'To be Dispatched'
                    ? 'Dispatch'
                    : 'Deliver'}
                </Button>
              )}
            {params.row.status === 'Delivered' && 'Delivered'}
            {params.row.status === 'Cancelled' && 'Cancelled'}
          </>
        )
      },
    },
  ]

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
                      label="Company Name"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('compName')}
                      error={!!errors.compName}
                      helperText={errors?.compName && errors.compName.message}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="Supplier Name"
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
                    {/* <TextField
                      sx={{ width: 300 }}
                      label="Area"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('area')}
                      error={!!errors.area}
                      helperText={errors?.area && errors.area.message}
                    /> */}
                    <FormControl variant="standard" error={!!errors.area}>
                      <InputLabel>Area</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: 230 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            // value={field.value}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="area"
                          >
                            {/* <MenuItem value={'Raigad'}>Raigad</MenuItem>
                        <MenuItem value={'Pen'}>Pen</MenuItem> */}
                            <MenuItem value={'Baner'}>Baner</MenuItem>
                            <MenuItem value={'Kothrud'}>Kothrud</MenuItem>
                            <MenuItem value={'Chinchwad'}>Chinchwad</MenuItem>
                            <MenuItem value={'Viman Nagar'}>
                              Viman Nagar
                            </MenuItem>
                            <MenuItem value={'Shivajinagar'}>
                              Shivajinagar
                            </MenuItem>
                          </Select>
                        )}
                        name="area"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.area ? errors.area.message : null}
                      </FormHelperText>
                    </FormControl>
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
                      label="Username"
                      variant="standard"
                      disabled
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('uname')}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="UPI"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('upi')}
                      error={!!errors.upi}
                      helperText={errors?.upi && errors.upi.message}
                    />
                  </div>
                  <h2 style={{ textAlign: 'center', marginTop: '8vh' }}>
                    STOCK
                  </h2>
                  <div className={styles.rowGap}>
                    <TextField
                      sx={{ width: 300 }}
                      label="Mask(s)"
                      type="number"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('mask')}
                      error={!!errors.mask}
                      helperText={errors?.mask && errors.mask.message}
                    />
                    <TextField
                      sx={{ width: 300 }}
                      label="Oxygen Cylinder(s)"
                      type="number"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('oxygencylinder')}
                      error={!!errors.oxygencylinder}
                      helperText={
                        errors?.oxygencylinder && errors.oxygencylinder.message
                      }
                    />

                    <TextField
                      sx={{ width: 300 }}
                      label="Remdevisir(s)"
                      type="number"
                      variant="standard"
                      InputLabelProps={{ shrink: !Loading }}
                      {...register('remdevisir')}
                      error={!!errors.remdevisir}
                      helperText={
                        errors?.remdevisir && errors.remdevisir.message
                      }
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
                    rowsPerPageOptions={[5]}
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

export default Index
