import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/login.module.css'
import { login } from '../../redux/slices/UserSlice'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../public/images/Logo.png'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { router } from 'next/router'
import axios from 'axios'

const Index = () => {
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    uname: yup.string().required('Please enter a username.'),
    pwd: yup.string().required('Please enter a password'),
  })

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  const user = {
    name: 'Karan Sable',
    address: '6A-902, Narmada Building, Mhada Society, Morewadi, Pimpri',
    pincode: 411018,
    mobile: 9890822495,

    uname: 'karansable16@gmail.com',
    userType: 'customer',
    // userType: 'supplier',
    // userType: 'admin',
  }

  const finish = (data) => {
    axios.post('http://localhost:4500/api/auth/login', data).then((res) => {
      if (res.status === 200) {
        console.log('Response from backend: ', res.data)
        dispatch(login(res.data))
        router.push('/')
      }
    })

    // if (data.uname === 'karansable16@gmail.com' && data.pwd === 'Karan@123') {
    //   dispatch(login(user))
    //   router.push('/')
    // }
  }

  return (
    <>
      <Head>
        <title>CHWP - Login</title>
      </Head>
      <div className={styles.main}>
        <div className={styles.loginForm}>
          <div className={styles.header} style={{ textAlign: 'center' }}>
            <Image src={logo} width={100} height={100} alt="Logo" />
            <h1>Covid Help Web Portal</h1>
          </div>
          <h2 style={{ fontFamily: 'Alladin', textAlign: 'center' }}>Login</h2>

          <form onSubmit={handleSubmit(finish)}>
            <div className={styles.fields}>
              <TextField
                sx={{ width: 250, marginBottom: 2 }}
                label="Username"
                variant="standard"
                {...register('uname')}
                error={!!errors.uname}
                helperText={errors?.uname && errors.uname.message}
              />
              <TextField
                sx={{ width: 250, marginBottom: 4 }}
                label="Password"
                type="password"
                variant="standard"
                {...register('pwd')}
                error={!!errors.pwd}
                helperText={errors?.pwd && errors.pwd.message}
              />

              <Button
                variant="contained"
                color="error"
                sx={{ backgroundColor: '#F92303' }}
                type="submit"
              >
                Login
              </Button>
            </div>
          </form>

          <span className={styles.register}>
            <span>Don't have an account?</span>
            <span>
              Register as a new
              <span className={styles.registerLinks}> Customer </span>
              or
              <span className={styles.registerLinks}> Supplier </span>
            </span>
          </span>
        </div>
      </div>
    </>
  )
}

export default Index
