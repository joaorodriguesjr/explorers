import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Rarity.module.css'
import Icon from '@Component/Icon'

interface Props {
  count: number
}

export const Rarity: FunctionComponent<Props> = ({ count }) => {
  const initial = Array(5).fill(0).map((charcater, index) => index < count ? 1 : 0)
  const [ characters, updateCharacters ] = useState(initial)

  const elements = characters.map((character, index) => {
    return (
      <span key={index} className={character === 1 ? styles.color : styles.nocolor}>
        <Icon name={'Star'}/>
      </span>
    )
  })

  return <>{elements}</>
}
