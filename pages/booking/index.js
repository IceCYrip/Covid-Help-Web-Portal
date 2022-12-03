import router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SideBar from '../../components/SideBar'
import styles from '../../styles/pages.module.css'
import { DataGrid } from '@mui/x-data-grid'
import {
  Button,
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

import axios from 'axios'
import { Edit, Search, Visibility } from '@mui/icons-material'
import Head from 'next/head'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export default function Home() {
  // @ts-ignore
  const user = useSelector((state) => state.user)
  const [table, setTable] = useState([])
  const [Loading, setLoading] = useState(false)
  const [runAgain, setRunAgain] = useState(false)

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
      field: 'suppName',
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
            <IconButton onClick={() => console.log(params.row)}>
              <Visibility sx={{ color: '#F92303' }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const finish = (data) => {
    setLoading(true)
    console.log('Sort cha Data: ', data)

    axios
      .post('http://localhost:4500/api/supplier/sortSuppliers', data)
      .then((res) => {
        console.log('Response: ', res.data)
        setTable(
          res.data.map((response, index) => ({
            srNo: index + 1,
            id: response._id,
            suppName: response.suppname,
            contact: response.contact,
          }))
        )
        setLoading(false)
        setRunAgain(true)
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
          <div className={styles.Content}>
            <h2 className={styles.TitleText}>
              Please select the requirements:
            </h2>
            <form onSubmit={handleSubmit(finish)}>
              <div className={styles.sortRow}>
                <FormControl variant='standard' error={!!errors.area}>
                  <InputLabel>Area</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '180px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // value={field.value}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='area'
                      >
                        <MenuItem value={'Raigad'}>Raigad</MenuItem>
                        <MenuItem value={'Pen'}>Pen</MenuItem>
                        <MenuItem value={'Baner'}>Baner</MenuItem>
                        <MenuItem value={'Kothrud'}>Kothrud</MenuItem>
                        <MenuItem value={'Chinchwad'}>Chinchwad</MenuItem>
                        <MenuItem value={'Viman Nagar'}>Viman Nagar</MenuItem>
                        <MenuItem value={'Shivajinagar'}>Shivajinagar</MenuItem>
                      </Select>
                    )}
                    name='area'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {errors?.area ? errors.area.message : null}
                  </FormHelperText>
                </FormControl>

                <TextField
                  sx={{ width: 150 }}
                  label='Mask'
                  variant='standard'
                  type='number'
                  {...register('mask')}
                  error={!!errors.mask}
                  helperText={errors?.mask && errors.mask.message}
                />
                <TextField
                  sx={{ width: 150 }}
                  label='Remdevisir'
                  variant='standard'
                  type='number'
                  {...register('remdevisir')}
                  error={!!errors.remdevisir}
                  helperText={errors?.remdevisir && errors.remdevisir.message}
                />
                <TextField
                  sx={{ width: 150 }}
                  label='Oxygen Cylinder'
                  variant='standard'
                  type='number'
                  {...register('oxygencylinder')}
                  error={!!errors.oxygencylinder}
                  helperText={
                    errors?.oxygencylinder && errors.oxygencylinder.message
                  }
                />

                <button
                  className={styles.customButton}
                  style={{ marginLeft: '1.5vw' }}
                  type='submit'
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
