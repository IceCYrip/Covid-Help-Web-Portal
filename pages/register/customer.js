import Head from 'next/head'
import React, { useState } from 'react'
import styles from '../../styles/pages.module.css'
import SideBar from '../../components/SideBar'
import Loader from '../../components/Loader'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const customer = () => {
  const [loading, setLoading] = useState(false)

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
    console.log('Data: ', data)
  }

  return (
    <>
      <Head>
        <title>CHWP - Account</title>
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
                Register as a new customer
              </h1>
              <div className={styles.row} style={{ marginTop: '5vh' }}>
                <TextField
                  sx={{ width: 300 }}
                  label="Full Name"
                  variant="standard"
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors?.fullName && errors.fullName.message}
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
          </div>
        </div>
      </div>
    </>
  )
}

export default customer
