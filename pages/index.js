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
import { Edit, Visibility } from '@mui/icons-material'
import Modal from '../components/Modal'
import Header from '../components/Header'
import NavBar from '../components/NavBar'

export default function Home() {
  // @ts-ignore
  const user = useSelector((state) => state.user)
  const [table, setTable] = useState([])
  const [loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(false)
  const [doctorModal, setDoctorModal] = useState()
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
            // srNo: index + 1,
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

  const columnsMain = [
    // {
    //   headerClassName: 'cellColor',
    //   field: 'srNo',
    //   headerName: 'Sr No.',
    //   flex: 0.5,
    //   sortable: false,
    // },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'doctorName',
      headerName: 'Doctor Name',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'area',
      headerName: 'Area',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'contact',
      headerName: 'Contact No.',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
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

  const columnsPhone = [
    // {
    //   headerClassName: 'cellColor',
    //   field: 'srNo',
    //   headerName: 'Sr No.',
    //   flex: 0.5,
    //   sortable: false,
    // },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'doctorName',
      headerName: 'Doctor Name',
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'area',
      headerName: 'Area',
      flex: 1,
      sortable: false,
    },
    // {
    //   headerClassName: 'cellColor',
    //   headerAlign: 'center',
    //   align: 'center',
    //   field: 'contact',
    //   headerName: 'Contact No.',
    //   flex: 1,
    //   sortable: false,
    // },
    {
      headerClassName: 'cellColor',
      headerAlign: 'center',
      align: 'center',
      field: 'actions',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      // hide: userType == 'admin' ? false : true,
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {userType == 'admin' && (
              <IconButton onClick={() => editDoctor(params.row)}>
                <Edit sx={{ color: '#F92303' }} />
              </IconButton>
            )}
            <IconButton onClick={() => editDoctor(params.row)}>
              <Visibility sx={{ color: '#F92303' }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const editDoctor = (data) => {
    setID(data.id)
    setDoctorModal({
      fullName: data.doctorName,
      area: data.area,
      contact: data.contact,
    })

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

          setDoctorModal()
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
        <title>Covid Help Web Portal</title>
      </Head>
      <div className={styles.main1}>
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
                      justifyContent: 'center',
                      columnGap: 30,
                    }}
                  >
                    <button
                      className={styles.customButton}
                      style={{
                        textTransform: 'uppercase',
                        fontFamily: 'bold',
                      }}
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      className={styles.button2}
                      style={{
                        width: '6vw',
                        height: '7vh',
                        fontSize: 'large',
                      }}
                      onClick={() => {
                        setDoctorModal()
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
          )}
          <div className={styles.Content}>
            <h2 className={styles.TitleText} style={{ marginBottom: '5vh' }}>
              {/* Below are the COVID helpline numbers of the doctors on call. */}
              Helpline numbers of doctors:
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
              columns={columnsMain}
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
      <div className={styles.main2}>
        <Header />
        {loading && <Loader />}

        {doctorModal && (
          <Modal>
            <div className={styles.doctorModal}>
              <h2>Doctor Details</h2>
              <div className={styles.modalContent}>
                <div className={styles.modalLeft}>
                  <span>Name</span>
                  <span>Area</span>
                  <span>Contact</span>
                </div>
                <div className={styles.modalRight}>
                  <span>: {doctorModal.fullName}</span>
                  <span>: {doctorModal.area}</span>
                  <span>: {doctorModal.contact}</span>
                </div>
              </div>
              <button
                className={styles.customButton}
                style={{
                  marginTop: '4vh',
                  textTransform: 'uppercase',
                  fontFamily: 'bold',
                }}
                onClick={() => {
                  setDoctorModal()
                }}
              >
                OK
              </button>
            </div>
          </Modal>
        )}

        <div className={styles.layout}>
          <h2 className={styles.TitleText}>Helpline numbers of doctors:</h2>
          <DataGrid
            sx={{
              '& .cellColor': {
                backgroundColor: '#F92303',
                color: 'white',
              },
              backgroundColor: 'white',
              zIndex: 0,
              border: '0px',
            }}
            autoHeight
            hideFooter
            disableSelectionOnClick
            disableColumnMenu
            rows={table}
            columns={columnsPhone}
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
        <NavBar />
      </div>
    </>
  )
}
