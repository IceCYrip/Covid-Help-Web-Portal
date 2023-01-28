import React, { useEffect, useState } from 'react'
import styles from '../../styles/pages.module.css'
import maskSVG from '../../public/images/mask.svg'
import o2SVG from '../../public/images/oxygen.svg'
import remdevisirSVG from '../../public/images/remdevisir.svg'

import { DataGrid } from '@mui/x-data-grid'
import Header from '../../components/Header'
import NavBar from '../../components/NavBar'
import sweetAlert from 'sweetalert'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Image from 'next/image'
import { IconButton } from '@mui/material'
import { Delete, Visibility } from '@mui/icons-material'
import Modal from '../../components/Modal'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [orderModal, setOrderModal] = useState()
  const [Loading, setLoading] = useState(true)
  const [runAgain, setRunAgain] = useState(true)

  // @ts-ignore
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    setRunAgain(false)
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
            fullName: j.fullName,
            address: j.address,
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
  }, [runAgain])

  const columns = [
    // {
    //   headerClassName: 'cellColor',
    //   field: 'srNo',
    //   headerName: 'Sr No.',
    //   width: 80,
    //   sortable: false,
    // },
    // {
    //   headerClassName: 'cellColor',
    //   field: 'fullName',
    //   headerName: 'Supplier Name',
    //   flex: 0.8,
    //   sortable: false,
    // },
    // {
    //   headerClassName: 'cellColor',
    //   field: 'address',
    //   headerName: 'Supplier Address',
    //   flex: 1,
    //   sortable: false,
    // },
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
      // width: 60,
      flex: 1,

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
      // width: 60,
      flex: 1,

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
      // width: 60,
      flex: 1,

      sortable: false,
    },

    // {
    //   headerClassName: 'cellColor',
    //   field: 'price',
    //   headerName: 'Price',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 120,

    //   sortable: false,
    // },
    // {
    //   headerClassName: 'cellColor',
    //   field: 'status',
    //   headerName: 'Status',
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 1,
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {params.row.status === 'To be Dispatched' ? (
    //           <>
    //             {params.row.status}
    //             <IconButton
    //               sx={{ color: '#F92303', marginLeft: 2 }}
    //               onClick={() => cancelOrder(params.row.srNo - 1)}
    //             >
    //               <Delete />
    //             </IconButton>
    //           </>
    //         ) : (
    //           params.row.status
    //         )}
    //       </>
    //     )
    //   },
    // },
    {
      headerClassName: 'cellColor',
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      // flex: 1,
      width: 80,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: '#F92303' }}
              onClick={() => viewOrder(params.row.srNo - 1)}
            >
              <Visibility />
            </IconButton>
          </>
        )
      },
    },
  ]

  const viewOrder = (id) => {
    setOrderModal(orders[id])
  }

  const cancelOrder = (index) => {
    setOrderModal()
    const bodyForApi = {
      orderId: orders[index]._id,
      status: 'cancel',
    }

    //Update Orders
    axios
      .post(`${process.env.NEXT_PUBLIC_HOST}/api/order/update`, bodyForApi)
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

  return (
    <>
      <div className={styles.main2}>
        <Header />
        {Loading && <Loader />}
        {orderModal && (
          <>
            <Modal>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    margin: '30px 10px',
                    marginTop: '15px',
                    textTransform: 'uppercase',
                    fontSize: 'medium',
                    fontWeight: 'bold',
                  }}
                >
                  Order Details (
                  <span
                    style={{
                      fontWeight: 'normal',
                    }}
                  >
                    {orderModal.status}
                  </span>
                  )
                </span>

                <div className={styles.modalContent}>
                  <div className={styles.modalLeft}>
                    <span>Supplier Name</span>
                    <span>Supplier Address</span>
                    <span>Mask</span>
                    <span>Oxygen Cylinder</span>
                    <span>Remdevisir</span>
                    <span>Price</span>
                    {/* <span>Status</span> */}
                  </div>
                  <div className={styles.modalRight}>
                    <span>: {orderModal.fullName}</span>
                    <span>: {orderModal.address}</span>
                    <span>: {orderModal.mask}</span>
                    <span>: {orderModal.oxygencylinder}</span>
                    <span>: {orderModal.remdevisir}</span>
                    <span style={{ fontWeight: 'bold' }}>
                      : Rs. {orderModal.price}
                    </span>
                    {/* <span>: {orderModal.status}</span> */}
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <button
                    className={styles.customButton}
                    style={{
                      textTransform: 'uppercase',
                      fontFamily: 'bold',
                    }}
                    onClick={() => {
                      setOrderModal()
                    }}
                  >
                    OK
                  </button>
                  {orderModal.status === 'To be Dispatched' && (
                    <button
                      className={styles.button2}
                      // style={{ marginTop: '10px' }}
                      onClick={() => {
                        cancelOrder(orderModal.id - 1)
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </Modal>
          </>
        )}

        <div className={styles.layout} style={{ margin: '5vw' }}>
          <h2 className={styles.TitleText}>My Orders</h2>
          <DataGrid
            sx={{
              '& .cellColor': {
                backgroundColor: '#F92303',
                color: 'white',
              },
              zIndex: 0,
              backgroundColor: 'white',
            }}
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
            pageSize={5}
            rows={orders}
            columns={columns}
          />
        </div>
        <NavBar />
      </div>
    </>
  )
}

export default Orders
