import React, { useEffect, useState } from 'react'
import styles from '../styles/components.module.css'
import logo from '../public/images/Logo.png'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/UserSlice'
import router from 'next/router'

const SideBar = () => {
  const dispatch = useDispatch()
  // @ts-ignore
  const userData = useSelector((state) => state.user.user)
  // @ts-ignore
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

  const [name, setName] = useState('')
  const [userType, setUserType] = useState('')
  const [loginState, setLoginState] = useState(false)

  useEffect(() => {
    if (userData.fullName) {
      setName(userData.fullName.split(' ')[0])
      setLoginState(isLoggedIn)
    } else {
      setName('User')
    }
    if (userData.usertype) {
      setUserType(userData.usertype)
    } else {
      setUserType('user')
    }
  }, [userData])

  const menu = [
    {
      name: 'DASHBOARD',
      clickTo: '/',
    },
    {
      name: userType === 'admin' ? 'REPORTS' : 'ACCOUNT',
      // clickTo: `/account/${userType}`,
      clickTo: userType === 'user' ? 'login' : `/account/${userType}`,
    },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Image
            priority
            onClick={() => router.push('/')}
            src={logo}
            width={100}
            height={100}
            alt="Logo"
            className={styles.headerContents}
          />
          <span
            className={styles.headerContents}
            onClick={() => router.push('/')}
          >
            Covid Help Web Portal{' '}
          </span>
        </div>

        <div className={styles.menu}>
          <span className={styles.name}>
            Welcome,
            <span
              className={styles.highlightedName}
              onClick={() => {
                router.push(`/${userType}`)
              }}
            >
              {' ' + name}
            </span>
          </span>
          {menu.map((menu, index) => {
            return (
              <div
                key={index}
                className={styles.menuCard}
                onClick={() => {
                  router.push(menu.clickTo)
                }}
              >
                <span>{menu.name}</span>
              </div>
            )
          })}
        </div>
        {loginState && (
          <div className={styles.footer}>
            <div
              className={styles.logout}
              onClick={() => {
                dispatch(logout())
                router.push('/login')
              }}
            >
              <span>LOGOUT</span>
            </div>
          </div>
        )}
        {!loginState && (
          <div className={styles.footer}>
            <div
              className={styles.logout}
              onClick={() => {
                router.push('/login')
              }}
            >
              <span>LOGIN</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBar
