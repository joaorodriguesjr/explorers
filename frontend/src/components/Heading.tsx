import { FunctionComponent } from 'react'
import styles from './Heading.module.css'

interface Props { size: number }

const Heading: FunctionComponent<Props> = ({size, children}) => {
  switch (size) {
    case 1:
      return <h1 className={styles.tag}>{children}</h1>
    case 2:
      return <h2 className={styles.tag}>{children}</h2>
    case 3:
      return <h3 className={styles.tag}>{children}</h3>
    case 4:
      return <h4 className={styles.tag}>{children}</h4>
    case 5:
      return <h5 className={styles.tag}>{children}</h5>
    case 6:
      return <h6 className={styles.tag}>{children}</h6>
    default:
      return <h1 className={styles.tag}>{children}</h1>
  }
}

export default Heading
