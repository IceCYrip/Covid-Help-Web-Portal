import React from 'react'
import Head from 'next/head'
import router from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SideBar from '../components/SideBar'
import styles from '../styles/pages.module.css'
import { DataGrid } from '@mui/x-data-grid'
import { IconButton, TextField } from '@mui/material'
import Loader from '../components/Loader'
import sweetAlert from 'sweetalert'

import axios from 'axios'
import { Edit } from '@mui/icons-material'
import Modal from '../components/Modal'

export default function Home() {
  // @ts-ignore
  const user = useSelector((state) => state.user)
  const [table, setTable] = useState([])
  const [loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const [doctorModal, setDoctorModal] = useState(false)
  const [userType, setUserType] = useState('')
  const [ID, setID] = useState('')

  const schema = yup.object().shape({
    fullName: yup.string().required('Please enter a name.'),
    contact: yup.number().required('Please enter a mobile no.'),
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
    // if (!user.isLoggedIn) {
    //   router.push('/login')
    // }
    if (user.user.usertype) {
      setUserType(user.user.usertype)
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/api/doctor/getAll`)
      .then((res) => {
        setTable(
          res.data.map((response, index) => ({
            srNo: index + 1,
            id: response._id,
            doctorName: response.fullName,
            area: response.area,
            contact: response.contact,
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

  const normalColumns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerName: 'Sr No.',
      flex: 0.5,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'doctorName',
      headerName: 'Doctor Name',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'area',
      headerName: 'Area',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'contact',
      headerName: 'Contact No.',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      hide: userType == 'admin' ? false : true,
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => editDoctor(params.row)}>
              <Edit sx={{ color: '#F92303' }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const editDoctor = (data) => {
    setID(data.id)
    setDoctorModal(true)
    reset({
      fullName: data.doctorName,
      area: data.area,
      contact: data.contact,
    })
  }

  const finish = (data) => {
    const bodyForApi = { ...data, _id: ID }

    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/doctor/save`, bodyForApi)
      .then((res) => {
        if (res.status === 200) {
          sweetAlert({
            title: 'Updated!',
            text: 'Doctor details updated successfully !',
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

          setDoctorModal(false)
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
    <div>
      <Head>
        <title>CHWP - Dashboard</title>
      </Head>
      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {loading && <Loader />}
          {doctorModal && (
            <Modal>
              <form onSubmit={handleSubmit(finish)}>
                <div className={styles.doctorModal}>
                  <h2>DOCTOR</h2>
                  <div className={styles.modalRow}>
                    <TextField
                      sx={{ width: 200 }}
                      label="Doctor Name"
                      variant="standard"
                      // InputLabelProps={{ shrink: !Loading }}
                      {...register('fullName')}
                      error={!!errors.fullName}
                      helperText={errors?.fullName && errors.fullName.message}
                    />
                    <TextField
                      sx={{ width: 200 }}
                      label="Area"
                      variant="standard"
                      // InputLabelProps={{ shrink: !Loading }}
                      {...register('area')}
                      error={!!errors.area}
                      helperText={errors?.area && errors.area.message}
                    />
                    <TextField
                      sx={{ width: 200 }}
                      label="Contact"
                      variant="standard"
                      // InputLabelProps={{ shrink: !Loading }}
                      {...register('contact')}
                      error={!!errors.contact}
                      helperText={errors?.contact && errors.contact.message}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      marginTop: '1vh',
                      width: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      className={styles.customButton}
                      onClick={() => {
                        setDoctorModal(false)
                      }}
                    >
                      {/* Cancel */}
                      cancel
                    </button>
                    <button
                      className={styles.customButton}
                      style={{
                        marginLeft: '2vw',
                        textTransform: 'uppercase',
                        fontFamily: 'bold',
                      }}
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
          )}
          <div className={styles.Content}>
            <h2 className={styles.TitleText} style={{ marginBottom: '5vh' }}>
              Below are the COVID helpline numbers of the doctors on call.
            </h2>
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
              columns={normalColumns}
            />

            {user.user.usertype !== 'supplier' &&
              user.user.usertype !== 'admin' && (
                <div className={styles.Button}>
                  <div
                    className={styles.customButton}
                    style={{ marginTop: '8vh', textTransform: 'uppercase' }}
                    onClick={() => {
                      router.push('/booking')
                    }}
                  >
                    Order Supplies
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
