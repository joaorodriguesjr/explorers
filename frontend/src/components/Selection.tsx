import { Asset } from '@Context/Game'
import { FunctionComponent, useState } from 'react'
import styles from './Selection.module.css'
import Icon from './Icon'

interface Props {
  selection: Asset[]

  onBurnClick: () => void
  onSellClick: () => void

  onSelectAllClick: () => void
}

const Selection: FunctionComponent<Props> = ({ selection, onBurnClick, onSellClick, onSelectAllClick }) => {
  const selected = selection.length > 0

  return <div className={styles.container}>
    <button className={selected ? styles.selected : ''} title='select all' onClick={onSelectAllClick}>
      {selected ? <Icon name='CheckboxMultipleChecked' /> : <Icon name='CheckboxMultipleBlank' />}
    </button>
    <div className={styles.count}>
      {selection.length.toString().padStart(2, '0')}
    </div>
    <div className={styles.actions}>
      <button onClick={onBurnClick}>Burn</button>
      <button onClick={onSellClick}>Sell</button>
    </div>
  </div>
}

export default Selection
