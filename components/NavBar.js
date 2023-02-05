import React, { useState, useEffect } from 'react'
import router from 'next/router'
import styles from '../styles/components.module.css'

import { IconButton } from '@mui/material'
import { useSelector } from 'react-redux'

import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'

const FooterBar = () => {
  const [userType, setUserType] = useState('')
  // const [loginState, setLoginState] = useState(false)

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const userData = useSelector((state) => state.user.user)
  const URL = router.asPath

  useEffect(() => {
    // if (userData.fullName) {
    //   setLoginState(isLoggedIn)
    // }
    // console.log('URL: ', URL)
    if (userData.usertype) {
      setUserType(userData.usertype)
    } else {
      setUserType('user')
    }
  }, [userData])

  const menu = [
    {
      icon: (
        <HomeIcon className={URL === `/` ? styles.selectedIcon : styles.icon} />
      ),
      clickTo: `/`,
    },
    {
      icon: (
        <ShoppingBasketIcon
          className={
            URL === `/account/orders` ? styles.selectedIcon : styles.icon
          }
        />
      ),
      clickTo: `/account/orders`,
    },
    {
      icon: (
        <PersonIcon
          className={
            URL === `/account/${userType}` ? styles.selectedIcon : styles.icon
          }
        />
      ),
      clickTo: `/account/${userType}`,
    },
  ]

  return (
    <>
      <div className={styles.navbar}>
        {menu.map((menu, index) => {
          return (
            <IconButton
              key={index}
              onClick={() => {
                if (!isLoggedIn) {
                  sweetAlert({
                    title: 'Login Not Found!',
                    text: 'Please Login first',
                    icon: 'warning',
                    buttons: {
                      confirm: {
                        text: 'OK',
                        visible: true,
                        closeModal: true,
                      },
                    },
                    dangerMode: true,
                  }).then(() => {
                    router.push('/login')
                  })
                } else {
                  router.push(menu.clickTo)
                }
              }}
            >
              {menu.icon}
            </IconButton>
          )
        })}
      </div>
    </>
  )
}

export default FooterBar
