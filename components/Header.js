import Image from 'next/image'
import React from 'react'
import router from 'next/router'
import styles from '../styles/components.module.css'
import logo from '../public/images/Logo.png'

const NavBar = () => {
  return (
    <>
      <div className={styles.header2}>
        <Image
          priority
          onClick={() => router.push('/')}
          src={logo}
          width={50}
          height={50}
          alt="Logo"
          className={styles.headerContents}
        />
        <h3 className={styles.headerContents} onClick={() => router.push('/')}>
          Covid Help Web Portal
        </h3>
      </div>
    </>
  )
}

export default NavBar
