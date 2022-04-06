import { FunctionComponent } from 'react'
import styles from './EmptyListInfo.module.css'


const EmptyListInfo: FunctionComponent = ({ children }) => {
  return <div className={styles.container}>
    {children}
  </div>
}

export default EmptyListInfo
