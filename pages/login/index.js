import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styles from '../../styles/login.module.css'
import { login } from '../../redux/slices/UserSlice'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../../public/images/Logo.png'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import router from 'next/router'
import axios from 'axios'
import loaderSvg from '../../public/loginLoader.svg'
import sweetAlert from 'sweetalert'

const Index = () => {
  const dispatch = useDispatch()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

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

  const finish = (data) => {
    setIsLoggingIn(true)
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, data)
      .then((res) => {
        if (res.status === 200) {
          const { _id, fullName, usertype } = res.data
          dispatch(login({ _id, fullName, usertype }))
          router.push('/')
          // setIsLoggingIn(false)
        } else {
          setTimeout(() => {
            setIsLoggingIn(false)
          }, 1000)
        }
      })
      .catch((error) => {
        console.log('error: ', error)
        setIsLoggingIn(false)
        sweetAlert({
          title: `${
            error.response.status === 400 ? 'Incorrent Credentials' : 'ERROR!'
          }`,
          text: `${
            error.response.status === 400
              ? 'Please enter correct username and password'
              : 'Something went wrong'
          }`,
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
                {isLoggingIn && (
                  <Image
                    style={{ marginLeft: 10 }}
                    src={loaderSvg}
                    height={30}
                    width={30}
                    alt="loader"
                    priority
                  />
                )}
              </Button>
            </div>
          </form>

          <span className={styles.register}>
            <span>{`Don't have an account?`}</span>
            <span>
              Register as a new
              <span
                className={styles.registerLinks}
                onClick={() => {
                  router.push('/register/customer')
                }}
              >
                {' '}
                Customer{' '}
              </span>
              or
              <span
                className={styles.registerLinks}
                onClick={() => {
                  router.push('/register/supplier')
                }}
              >
                {' '}
                Supplier{' '}
              </span>
            </span>
          </span>
        </div>
      </div>
    </>
  )
}

export default Index
