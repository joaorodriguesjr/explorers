import { useCallback, useEffect, useState } from 'react'

const ONE_SECOND = 1000

export function useTimer(start: number, duration: number) {
  const currentTime = useCallback(() => {
    return (start + duration - Date.now())
  }, [])

  const timeout = useCallback(() => {
    return currentTime() < ONE_SECOND
  }, [])

  const [ time, updateTime ] = useState(currentTime())

  useEffect(() => {
    if (timeout())
      return

    const id = setTimeout(() => {
      updateTime(currentTime())
    }, ONE_SECOND)

    return () => {
      clearTimeout(id)
    }
  }, [ time ])

  return {
    time, timeout,

    get hours() {
      return Math.floor(time / (60 * 60 * ONE_SECOND))
    },

    get minutes() {
      return Math.floor(time / (60 * ONE_SECOND)) % 60
    },

    get seconds() {
      return Math.floor(time / ONE_SECOND) % 60
    }
  }
}
