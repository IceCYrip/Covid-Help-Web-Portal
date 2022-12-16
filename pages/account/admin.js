import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import SideBar from '../../components/SideBar'

import styles from '../../styles/pages.module.css'
import Loader from '../../components/Loader'
import sweetAlert from 'sweetalert'
import axios from 'axios'
import { useSelector } from 'react-redux'

const index = () => {
  const [Loading, setLoading] = useState(true)
  const [reports, setReports] = useState({})

  const adminID = useSelector((state) => state.user.user._id)

  useEffect(() => {
    axios
      .post('http://localhost:4500/api/admin/reports', {
        _id: adminID,
      })
      .then((res) => {
        console.log('Reports: ', res.data)
        setReports(res.data)
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
  }, [])

  return (
    <>
      <Head>
        <title>CHWP - Account</title>
      </Head>

      <div className={styles.main}>
        <SideBar />
        <div className={styles.rightSide}>
          {Loading && <Loader />}
          <div className={styles.Content}>Karan</div>
        </div>
      </div>
    </>
  )
}

export default index
