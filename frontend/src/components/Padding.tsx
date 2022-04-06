import { FunctionComponent } from 'react'
import styles from './Padding.module.css'

interface Props {
  horizontal?: boolean
  vertical?: boolean
  grow?: boolean
}

const Padding: FunctionComponent<Props> = ({ horizontal = true, vertical = true, children, grow = false }) => {
  const classes = []
  if (horizontal) classes.push(styles.horizontal)
  if (vertical) classes.push(styles.vertical)
  if (grow) classes.push(styles.grow)

  return <div className={classes.join(' ')}>
    {children}
  </div>
}

export default Padding
