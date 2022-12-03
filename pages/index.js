import Head from 'next/head'
import Image from 'next/image'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SideBar from '../components/SideBar'
import styles from '../styles/pages.module.css'
import { DataGrid } from '@mui/x-data-grid'
import { Button, IconButton } from '@mui/material'
import Loader from '../components/Loader'
import React from 'react'

import axios from 'axios'
import { Edit } from '@mui/icons-material'

export default function Home() {
  // @ts-ignore
  const user = useSelector((state) => state.user)
  const [table, setTable] = useState([])
  const [userType, setUserType] = useState('')
  const [Loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.push('/login')
    }
    if (user.user.usertype) {
      setUserType(user.user.usertype)
    }

    axios.get('http://localhost:4500/api/doctor/getAll').then((res) => {
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
  }, [])

  const rows = [
    {
      id: 1,
      srNo: 1,
      doctorName: 'Phoebe Buffay',
      area: 'Viman Nagar',
      contact: 9503130607,
    },
    {
      id: 2,
      srNo: 2,
      doctorName: 'Joey Tribbiani',
      area: 'Kothrud',
      contact: 942682441,
    },
    {
      id: 3,
      srNo: 3,
      doctorName: 'Chandler Bing',
      area: 'Pimpri-Chinchwad',
      contact: 9890822495,
    },
    {
      id: 4,
      srNo: 4,
      doctorName: 'Ross Geller',
      area: 'Baner',
      contact: 9562210821,
    },
    {
      id: 5,
      srNo: 5,
      doctorName: 'Monica Geller',
      area: 'Aundh',
      contact: 970051264,
    },
  ]

  const normalColumns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerName: 'Sr No.',
      // width: 80,
      flex: 0.5,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'doctorName',
      headerName: 'Doctor Name',
      // width: 250,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'area',
      headerName: 'Area',
      // width: 150,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'contact',
      headerName: 'Contact No.',
      // width: 150,
      flex: 1,
      sortable: false,
    },
  ]
  const admincolumns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerName: 'Sr No.',
      // width: 80,
      flex: 0.5,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'doctorName',
      headerName: 'Doctor Name',
      // width: 250,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'area',
      headerName: 'area',
      // width: 150,
      flex: 1,
      sortable: false,
    },
    {
      headerClassName: 'cellColor',
      field: 'contact',
      headerName: 'Contact No.',
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
            <IconButton
            // disabled={collapse}
            // onClick={() => editById(params.row)}
            >
              <Edit sx={{ color: '#F92303' }} />
            </IconButton>
            {/* <IconButton
              disabled={collapse}
              onClick={() => deleteById(params.id)}
            >
              <Delete />
            </IconButton> */}
          </>
        )
      },
    },
  ]

  return (
    <div>
      <Head>
        <title>CHWP - Dashboard</title>
      </Head>
      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {Loading && <Loader />}
          <div className={styles.Content}>
            <h2 className={styles.TitleText}>
              Below are the COVID helpline numbers of the doctors on call.
            </h2>
            <DataGrid
              sx={{
                '& .cellColor': {
                  backgroundColor: '#F92303',
                  color: 'white',
                },
              }}
              autoHeight
              hideFooter
              disableSelectionOnClick
              disableColumnMenu
              rows={table}
              columns={userType == 'admin' ? admincolumns : normalColumns}
            />

            {user.user.usertype == 'customer' && (
              <div className={styles.Button}>
                <div
                  className={styles.customButton}
                  style={{ marginTop: '8vh' }}
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
