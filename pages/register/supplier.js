import Head from 'next/head'
import React, { useState } from 'react'
import styles from '../../styles/pages.module.css'
import SideBar from '../../components/SideBar'
import Loader from '../../components/Loader'
import validator from '../../components/validator'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import swal from 'sweetalert'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/slices/UserSlice'
import router from 'next/router'

const Supplier = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    compName: yup.string().required('Please enter company/shop name.'),
    fullName: yup.string().required("Please enter supplier's name."),
    address: yup.string().required('Please enter an address'),
    area: yup.string().required('Please select an area'),
    // pincode: yup.number().required('Please enter a pincode'),
    pincode: yup.number().typeError('Please enter a pincode').required(),
    contact: yup.number().typeError('Please enter a mobile no.').required(),
    upi: yup.string().required('Please enter a UPI id'),
    uname: yup.string().required('Please enter a username'),
    password: yup
      .string()
      .required('Please enter a password')
      .min(8, 'Password length should be more than 8 characters'),
    confirmPassword: yup
      .string()
      .required('Please confirm the password')
      .min(8, 'Password length should be more than 8 characters'),
    mask: yup.number().typeError('Please enter masks in stock.').required(),
    remdevisir: yup
      .number()
      .typeError('Please enter remdevisirs in stock.')
      .required(),
    oxygencylinder: yup
      .number()
      .typeError('Please enter oxygen cylinders in stock.')
      .required(),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  const finish = (data) => {
    if (validator(data)) {
      const { confirmPassword, ...rest } = data
      const bodyForAPI = { ...rest }

      axios
        .post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/checkAvailability`, {
          uname: data.uname,
        })
        .then((res) => {
          if (res.status === 200) {
            axios
              .post(
                `${process.env.NEXT_PUBLIC_HOST}/api/supplier/save`,
                bodyForAPI
              )
              .then((res) => {
                if (res.status === 201) {
                  swal({
                    title: 'Registration Successful',
                    text: 'Supplier account created successfully',
                    icon: 'success',
                    buttons: {
                      confirm: {
                        text: 'OK',
                        visible: true,
                        closeModal: true,
                      },
                    },
                    dangerMode: true,
                  }).then(() => {
                    axios
                      .post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, {
                        uname: data.uname,
                        pwd: data.password,
                      })
                      .then((res) => {
                        if (res.status === 200) {
                          setLoading(true)
                          const { _id, fullName, usertype } = res.data
                          dispatch(login({ _id, fullName, usertype }))
                          router.push('/')
                        }
                      })
                      .catch((error) => {
                        console.log('error: ', error)
                        swal({
                          title: 'Error',
                          text: 'Something went wrong',
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
                  })
                }
              })
              .catch((error) => {
                swal({
                  title: 'Error',
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
        })
        .catch((error) => {
          swal({
            title: `Error`,
            text: 'Username already exists',
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
  }

  return (
    <>
      <Head>
        <title>CHWP - Register as Supplier</title>
      </Head>

      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {loading && <Loader />}
          <div className={styles.Content}>
            <form onSubmit={handleSubmit(finish)}>
              <h1
                className={styles.TitleText}
                style={{ textTransform: 'uppercase' }}
              >
                Register as a new
                <span style={{ color: 'red' }}> supplier</span>
              </h1>
              <div
                className={styles.rowGap}
                style={{ marginTop: '4vh', marginLeft: '1vw' }}
              >
                <TextField
                  sx={{ width: 230 }}
                  label="Company Name"
                  variant="standard"
                  {...register('compName')}
                  error={!!errors.compName}
                  helperText={errors?.compName && errors.compName.message}
                />
                <TextField
                  sx={{ width: 230 }}
                  label="Supplier Name"
                  variant="standard"
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors?.fullName && errors.fullName.message}
                />

                <TextField
                  sx={{ width: 230 }}
                  label="Address"
                  variant="standard"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors?.address && errors.address.message}
                />

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
              </div>
              <div className={styles.rowGap} style={{ marginLeft: '1vw' }}>
                <TextField
                  sx={{ width: 230 }}
                  label="Pincode"
                  variant="standard"
                  {...register('pincode')}
                  error={!!errors.pincode}
                  helperText={errors?.pincode && errors.pincode.message}
                />
                <TextField
                  sx={{ width: 230 }}
                  label="Contact"
                  variant="standard"
                  {...register('contact')}
                  error={!!errors.contact}
                  helperText={errors?.contact && errors.contact.message}
                />

                <TextField
                  sx={{ width: 230 }}
                  label="UPI"
                  variant="standard"
                  {...register('upi')}
                  error={!!errors.upi}
                  helperText={errors?.upi && errors.upi.message}
                />
                <TextField
                  sx={{ width: 230 }}
                  label="Username"
                  variant="standard"
                  {...register('uname')}
                  error={!!errors.uname}
                  helperText={errors?.uname && errors.uname.message}
                />
              </div>

              <div className={styles.row}>
                {/* <TextField
                  sx={{ width: 230 }}
                  label="Username"
                  variant="standard"
                  {...register('uname')}
                  error={!!errors.uname}
                  helperText={errors?.uname && errors.uname.message}
                /> */}
                <TextField
                  sx={{ width: 230 }}
                  label="Password"
                  type="password"
                  variant="standard"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors?.password && errors.password.message}
                />
                <TextField
                  sx={{ width: 230 }}
                  label="Confirm Password"
                  type="password"
                  variant="standard"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors?.confirmPassword && errors.confirmPassword.message
                  }
                />
              </div>
              <h2
                style={{
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: '3vh',
                }}
              >
                STOCK
              </h2>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: '2vh',
                  marginTop: '-1.5vh',
                }}
              >
                <span>
                  {'(Please enter 0 if you dont sell any item listed below)'}
                </span>
              </div>
              <div className={styles.rowGap}>
                <TextField
                  sx={{ width: 300 }}
                  label="Mask(s)"
                  type="number"
                  variant="standard"
                  {...register('mask')}
                  error={!!errors.mask}
                  helperText={errors?.mask && errors.mask.message}
                />
                <TextField
                  sx={{ width: 300 }}
                  label="Oxygen Cylinder(s)"
                  type="number"
                  variant="standard"
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
                  {...register('remdevisir')}
                  error={!!errors.remdevisir}
                  helperText={errors?.remdevisir && errors.remdevisir.message}
                />
              </div>

              <div className={styles.Button}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    backgroundColor: '#F92303',
                    marginTop: '2vh',
                    width: 150,
                    height: 50,
                    fontSize: 'larger',
                    borderRadius: '15px',
                  }}
                  type="submit"
                >
                  CREATE
                </Button>
              </div>
              <h3
                style={{
                  textAlign: 'center',

                  marginTop: '4vh',
                }}
              >
                Already have an account?{' '}
                <span
                  style={{
                    color: 'red',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    router.push('/login')
                  }}
                >
                  Sign in
                </span>
              </h3>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Supplier
