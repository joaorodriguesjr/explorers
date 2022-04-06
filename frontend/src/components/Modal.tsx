import { classNames } from '@Helper/classNames'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Modal.module.css'

interface Props {
  visible: boolean
  onOverlayClick: () => void
}


const Modal: FunctionComponent<Props> = ({ visible, onOverlayClick, children }) => {
  const classes = visible
    ? classNames(styles.container, styles.visible)
    : classNames(styles.container, styles.hidden)

  return (
    <div className={classes} onClick={onOverlayClick}>{children}</div>
  )
}

export default Modal
