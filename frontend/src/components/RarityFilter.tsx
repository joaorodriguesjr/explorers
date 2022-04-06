import { FunctionComponent, useState } from 'react'
import styles from './RarityFilter.module.css'

interface Props {
  initial: number
  empty: number[]
  onRarityChange: (rarity: number) => void
}

const RarityFilter: FunctionComponent<Props> = ({ initial, empty, onRarityChange }) => {
  const [rarity, updateRarity] = useState(initial)

  function handleClick(rarity: number) {
    updateRarity(rarity)
    onRarityChange(rarity)
  }

  if (empty.includes(rarity)) {
    setTimeout(() => { updateRarity(0) , onRarityChange(0) }, 100)
  }

  return <div className={styles.box}>
    <div className={styles.label}>Filter</div>

    <div className={styles.rarities}>
      <button className={rarity === 0 ? styles.active : ''} onClick={() => handleClick(0)}>
        All
      </button>
      <button className={rarity === 1 ? styles.active : ''} onClick={() => handleClick(1)} disabled={empty.includes(1)}>
        1
      </button>
      <button className={rarity === 2 ? styles.active : ''} onClick={() => handleClick(2)} disabled={empty.includes(2)}>
        2
      </button>
      <button className={rarity === 3 ? styles.active : ''} onClick={() => handleClick(3)} disabled={empty.includes(3)}>
        3
      </button>
      <button className={rarity === 4 ? styles.active : ''} onClick={() => handleClick(4)} disabled={empty.includes(4)}>
        4
      </button>
      <button className={rarity === 5 ? styles.active : ''} onClick={() => handleClick(5)} disabled={empty.includes(5)}>
        5
      </button>
    </div>
  </div>
}

export default RarityFilter
