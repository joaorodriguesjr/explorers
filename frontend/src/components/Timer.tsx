import { FunctionComponent, useEffect } from 'react'
import styles from './Timer.module.css'
import { useTimer } from '@Hook/Timer'

interface TimerProps {
  start: number
  duration: number
  onTimeout: () => void
}

const Timer: FunctionComponent<TimerProps> = ({ start, duration, onTimeout = () => {} }) => {
  const timer = useTimer(start, duration)

  useEffect(() => {
    if (timer.timeout()) onTimeout()
  }, [ timer ])

  if (timer.timeout()) return (
    <div className={styles.container}>
      <>00:00:00</>
    </div>
  )

  return (
    <div className={styles.container}>
      <Unit value={timer.hours}/>:<Unit value={timer.minutes}/>:<Unit value={timer.seconds}/>
    </div>
  )
}

function Unit({ value }: { value: number }) {
  return <>
    { value < 10 ? '0' + value : value }
  </>
}

export default Timer
