import { FunctionComponent, useState } from 'react'
import styles from './Mint.module.css'

interface MintProps {
  balance: number
  onMintClick: (count: number) => void
}

const Mint: FunctionComponent<MintProps> = ({ balance, onMintClick }) => {
  const [ count, updateCount ] = useState(10)

  if(balance < count * 1000) {
    updateCount(0)
  }

  return (
    <div className={styles.container}>
      <div className={styles.description}>
          <div className={styles.controls}>
            <button disabled={(count + 10) * 1000 > balance} onClick={() => updateCount(prev => prev + 10) }>▲</button>
            <span>{count}</span>
            <button disabled={(count - 10) < 1 } onClick={() => updateCount(prev => prev - 10) }>▼</button>
          </div>

          <div className={styles.cost}>
            Cost: <span>${count * 10}.00</span>
          </div>
        </div>

        <div className={styles.action}>
          <button disabled={balance < 1000} onClick={() => onMintClick(count)}>Mint</button>
        </div>
    </div>
  )
}

export default Mint
