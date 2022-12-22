import Image from 'next/image'
import React from 'react'
import loader from '../public/loader.svg'

const Loader = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: '50px',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.20)',
      }}
    >
      <Image src={loader} alt="Loader" priority height={60} width={60} />
    </div>
  )
}

export default Loader
