import { FunctionComponent } from 'react'
import styles from './Stars.module.css'

const Stars: FunctionComponent<{count: number}> = ({count}) => {
  const stars = Array(count).fill(null).map((_, index) => <span key={index} className={styles.star}>⭐</span>)
  return <>{stars}</>
}

export default Stars
