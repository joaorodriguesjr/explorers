import { FunctionComponent } from 'react'
import styles from './Balance.module.css'

const Balance: FunctionComponent<{value: number}> = ({value}) => {
  const data = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100)
  return <div className={styles.container}>{data}</div>
}

export default Balance
