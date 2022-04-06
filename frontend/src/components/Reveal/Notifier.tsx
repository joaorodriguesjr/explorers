import { FunctionComponent } from 'react'
import styles from './Notifier.module.css'
import { classNames } from '@Helper/classNames'
import { useReveal } from '@Hook/Reveal'


interface Props {
  type: string, onClick: () => void
}

const Notifier: FunctionComponent<Props> = ({ type, onClick }) => {
  const reveal = useReveal()

  if (! reveal) {
    return null
  }

  const classes = reveal.hasAssets(type)
    ? classNames(styles.container, styles.show)
    : classNames(styles.container, styles.hide)

  return <div className={classes} onClick={onClick}>
    ?
    <div className={styles.count}>{reveal.assets(type).length}</div>
  </div>
}

export default Notifier
