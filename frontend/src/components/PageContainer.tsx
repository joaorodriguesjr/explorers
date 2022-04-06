import { FunctionComponent } from 'react'
import styles from './PageContainer.module.css'

const PageContainer: FunctionComponent = ({children}) => {
  return <div className={styles.box}>{children}</div>
}

export default PageContainer
