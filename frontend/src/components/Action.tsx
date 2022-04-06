import { FunctionComponent } from 'react'
import styles from './Action.module.css'

interface MainActionButtonProps {
  onclick: () => void
  disabled?: boolean
}

export const MainActionButton: FunctionComponent<MainActionButtonProps> = ({onclick, disabled = false, children}) => {
  return <button className={styles.main__button} disabled={disabled} onClick={onclick}>
    {children}
  </button>
}
