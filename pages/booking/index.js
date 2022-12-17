import router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SideBar from '../../components/SideBar'
import styles from '../../styles/pages.module.css'
import { DataGrid } from '@mui/x-data-grid'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Loader from '../../components/Loader'
import React from 'react'
import sweetAlert from 'sweetalert'

import axios from 'axios'
import { CottageSharp, Edit, Search, Visibility } from '@mui/icons-material'
import Head from 'next/head'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Modal from '../../components/Modal'

export default function Home() {
  // @ts-ignore
  const user = useSelector((state) => state.user)
  const [supplierDetails, setSupplierDetails] = useState({
    suppName: '',
    compName: '',
    contact: 1,
    address: '',
    area: '',
    pincode: 1,
    upi: '',
  })
  const [table, setTable] = useState([])
  const [Loading, setLoading] = useState(false)
  const [supplierModal, setSupplierModal] = useState(false)
  const [orderModal, setOrderModal] = useState(false)
  const [runAgain, setRunAgain] = useState(false)
  const [order, setOrder] = useState({
    mask: 1,
    remdevisir: 1,
    oxygencylinder: 1,
  })
  const maskPrice = 20
  const remdevisirPrice = 100
  const oxygenCylinderPrice = 400

  const schema = yup.object().shape({
    area: yup.string().required('Please enter no. of area'),
    mask: yup.number().required('Please enter no. of mask(s)'),
    remdevisir: yup.number().required('Please enter no. of remdesivir(s)'),
    oxygencylinder: yup
      .number()
      .required('Please enter no. of oxygencylinder(s)'),
  })

  const {
    register,
    handleSubmit,
    control,
    // watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push('/login')
    }
    setRunAgain(false)
  }, [runAgain])

  const columns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerName: 'Sr No.',
      width: 80,
      // flex: 0.5,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'fullName',
      headerName: 'Supplier Name',
      // width: 250,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'contact',
      headerName: 'Contact',
      // width: 150,
      flex: 1,
      sortable: false,
    },

    {
      headerClassName: 'cellColor',
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      // flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => fetchSupplier(params.row.id)}>
              <Visibility sx={{ color: '#F92303' }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const cost = () => {
    const price =
      maskPrice * order.mask +
      remdevisirPrice * order.remdevisir +
      oxygenCylinderPrice * order.oxygencylinder

    return price
  }

  const fetchSupplier = (id) => {
    setSupplierModal(true)
    axios
      .post('http://localhost:4500/api/supplier/getDetails', { _id: id })
      .then((res) => {
        console.log('Supplier: ', res.data)

        setSupplierDetails({ ...res.data })
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

  const finish = (data) => {
    setLoading(true)
    console.log('Sort cha Data: ', data)
    setOrder(data)
    axios
      .post('http://localhost:4500/api/supplier/sortSuppliers', data)
      .then((res) => {
        console.log('Response: ', res.data)
        setTable(
          res.data.map((response, index) => ({
            srNo: index + 1,
            id: response._id,
            fullName: response.fullName,
            contact: response.contact,
          }))
        )
        setLoading(false)
        setRunAgain(true)
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

  const placeOrder = (supplier, order) => {
    const bodyForApi = {
      customerId: user.user._id,
      supplierId: supplier.id,
      mask: order.mask,
      remdevisir: order.remdevisir,
      oxygencylinder: order.oxygencylinder,
      price: cost(),
    }

    setOrderModal(false)
    axios
      .post('http://localhost:4500/api/order/new', bodyForApi)
      .then((res) => {
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
        setLoading(false)
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

  return (
    <div>
      <Head>
        <title>CHWP - Booking</title>
      </Head>
      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {Loading && <Loader />}
          {supplierModal && (
            <Modal>
              <h2
                style={{
                  marginTop: 15,
                  marginBottom: 25,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}
              >
                Supplier Details
              </h2>
              <div className={styles.modalContent}>
                <div className={styles.modalLeft}>
                  <span>Supplier Name </span>
                  <span>Company Name </span>
                  <span>Contact </span>
                  <span>Address </span>
                  <span>Area </span>
                  <span>Pincode </span>
                  <span>UPI </span>
                </div>
                <div className={styles.modalRight}>
                  <span>: {supplierDetails.fullName}</span>
                  <span>: {supplierDetails.compName}</span>
                  <span>: {supplierDetails.contact}</span>
                  <span>: {supplierDetails.address}</span>
                  <span>: {supplierDetails.area}</span>
                  <span>: {supplierDetails.pincode}</span>
                  <span>: {supplierDetails.upi}</span>
                </div>
              </div>
              <div className={styles.buttonBox}>
                <button
                  className={styles.customButton}
                  style={{ width: 200 }}
                  onClick={() => {
                    setSupplierModal(false)
                    setOrderModal(true)
                  }}
                >
                  Go to Checkout
                </button>
                <button
                  className={styles.button2}
                  style={{
                    width: 100,
                    marginTop: 5,
                    textTransform: 'uppercase',
                  }}
                  onClick={() => {
                    setSupplierModal(false)
                  }}
                >
                  Back
                </button>
              </div>
            </Modal>
          )}
          {orderModal && (
            <Modal>
              <div>
                <h2
                  style={{
                    margin: 0,
                    marginTop: 15,
                    marginBottom: 25,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  Order
                </h2>
                <div className={styles.modalContent}>
                  <div className={styles.modalLeft}>
                    <span>Supplier Name </span>
                    <span>Company Name </span>
                    <span>UPI </span>
                    <span>Mask(s) </span>
                    <span>Remdevisir(s) </span>
                    <span>Oxygen Cylinder(s) </span>
                    <span>Total Cost: </span>
                  </div>
                  <div className={styles.modalRight}>
                    <span>: {supplierDetails.fullName}</span>
                    <span>: {supplierDetails.compName}</span>
                    <span>: {supplierDetails.upi}</span>
                    <span>
                      : {order.mask} x Rs.{maskPrice}
                    </span>
                    <span>
                      : {order.remdevisir} x Rs.{remdevisirPrice}
                    </span>
                    <span>
                      : {order.oxygencylinder} x Rs.{oxygenCylinderPrice}
                    </span>
                    <span>
                      : <span style={{ fontWeight: 'bold' }}>Rs. {cost()}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.buttonBox}>
                <button
                  className={styles.customButton}
                  onClick={() => {
                    placeOrder(supplierDetails, order)
                  }}
                >
                  Place Order
                </button>
                <button
                  className={styles.button2}
                  style={{
                    width: 100,
                    marginTop: 5,
                    textTransform: 'uppercase',
                  }}
                  onClick={() => {
                    setSupplierModal(true)
                    setOrderModal(false)
                  }}
                >
                  Back
                </button>
              </div>
            </Modal>
          )}
          <div className={styles.Content}>
            <h2 className={styles.TitleText}>
              Please select the requirements:
            </h2>
            <form onSubmit={handleSubmit(finish)}>
              <div className={styles.sortRow}>
                <FormControl variant="standard" error={!!errors.area}>
                  <InputLabel>Area</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '180px' }}
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
                        <MenuItem value={'Viman Nagar'}>Viman Nagar</MenuItem>
                        <MenuItem value={'Shivajinagar'}>Shivajinagar</MenuItem>
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
                  sx={{ width: 150 }}
                  label="Mask"
                  variant="standard"
                  type="number"
                  {...register('mask')}
                  error={!!errors.mask}
                  helperText={errors?.mask && errors.mask.message}
                />
                <TextField
                  sx={{ width: 150 }}
                  label="Remdevisir"
                  variant="standard"
                  type="number"
                  {...register('remdevisir')}
                  error={!!errors.remdevisir}
                  helperText={errors?.remdevisir && errors.remdevisir.message}
                />
                <TextField
                  sx={{ width: 150 }}
                  label="Oxygen Cylinder"
                  variant="standard"
                  type="number"
                  {...register('oxygencylinder')}
                  error={!!errors.oxygencylinder}
                  helperText={
                    errors?.oxygencylinder && errors.oxygencylinder.message
                  }
                />

                <button
                  className={styles.customButton}
                  style={{ marginLeft: '1.5vw' }}
                  type="submit"
                >
                  <Search sx={{ marginRight: '0.5vw' }} />
                  Search
                </button>
              </div>
            </form>
            <span className={styles.subTitleText}>
              IMPORTANT: All the suppliers sell government authorised supplies
              with same rates.
            </span>
            <DataGrid
              sx={{
                '& .cellColor': {
                  backgroundColor: '#F92303',
                  color: 'white',
                },
                zIndex: 0,
              }}
              autoHeight
              hideFooter
              disableSelectionOnClick
              disableColumnMenu
              rows={table}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
