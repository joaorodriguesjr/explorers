import { FunctionComponent } from 'react'
import styles from './Time.module.css'

interface TimeProps {
  timestamp: number
}

const Time: FunctionComponent<TimeProps> = ({ timestamp }) => {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const intl = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    hour12: false,
  })

  return (
    <>{intl.format(date)}</>
  )
}

export default Time
