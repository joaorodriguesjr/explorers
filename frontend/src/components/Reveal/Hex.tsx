import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Hex.module.css'

const options = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ]

function random(): string {
  return options[Math.floor(Math.random() * options.length)]
}

export const Hex: FunctionComponent = () => {
  const initial = Array(6).fill('0').map(() => random())
  const [ characters, updateCharacters ] = useState(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      updateCharacters(characters.map(() => random()))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return <>{characters}</>
}
