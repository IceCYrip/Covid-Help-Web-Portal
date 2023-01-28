import React from 'react'
import Header from './Header'
import NavBar from './NavBar'

const BasicLayout = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <NavBar />
    </>
  )
}

export default BasicLayout
