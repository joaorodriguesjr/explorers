import { FunctionComponent } from 'react'
import styles from './Shortener.module.css'

const Shortener: FunctionComponent<{data: string, size?: number }> = ({ data, size = 6 }) => {
  return <>
    {data.substring(0, size / 2)}{data.substring(data.length - (size / 2), data.length)}
  </>
}

export default Shortener
