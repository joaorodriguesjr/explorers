import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Power.module.css'

const options = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]

function random(): string {
  return options[Math.floor(Math.random() * options.length)]
}

export const Power: FunctionComponent = () => {
  const initial = Array(3).fill('0').map(() => random())
  const [ characters, updateCharacters ] = useState(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      updateCharacters(characters.map(() => random()))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return <>{characters} MP</>
}
