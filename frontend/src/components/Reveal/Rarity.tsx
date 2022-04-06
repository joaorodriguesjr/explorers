import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Rarity.module.css'
import Icon from '@Component/Icon'


function random(): number {
  return Math.round(Math.random())
}


export const Rarity: FunctionComponent = () => {
  const initial = Array(5).fill(0).map(() => random())
  const [ characters, updateCharacters ] = useState(initial)

  useEffect(() => {
    const interval = setInterval(() => {
      updateCharacters(characters.map(() => random()))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const elements = characters.map((character, index) => {
    return (
      <span key={index} className={character ? styles.color : styles.nocolor}>
        <Icon name={'Star'}/>
      </span>
    )
  })

  return <>{elements}</>
}
