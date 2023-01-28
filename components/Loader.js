import Image from 'next/image'
import React from 'react'
import loader from '../public/loader.svg'
import style from '../styles/components.module.css'

const Loader = () => {
  return (
    <div className={style.loader}>
      <Image src={loader} alt="Loader" priority height={60} width={60} />
    </div>
  )
}

export default Loader
