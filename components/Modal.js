import React from 'react'
import styles from '../styles/components.module.css'

const Modal = (props) => {
  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>{props.children}</div>
    </div>
  )
}

export default Modal
