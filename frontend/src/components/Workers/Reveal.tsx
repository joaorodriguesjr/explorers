import { FunctionComponent, useEffect, useState } from 'react'
import styles from './Reveal.module.css'
import { Worker } from '@Context/Game'
import Modal from '@Component/Modal'
import { Rarity } from '@Component/Reveal/Rarity'
import { Rarity as RevealedRarity } from '@Component/Rarity'
import { Hex } from '@Component/Reveal/Hex'
import Shortener from '@Component/Shortener'
import { useReveal } from '@Hook/Reveal'
import Notifier from '@Component/Reveal/Notifier'
import { classNames } from '@Helper/classNames'
import { Power } from '@Component/Reveal/Power'


const Reveal: FunctionComponent = ({ children }) => {
  const reveal = useReveal()

  const [ containerClasses, updateContainerClasses ] = useState(styles.container)
  const [ done, updateDone ] = useState(false)
  const [ revealing, updateRevealing ] = useState(true)
  const index = 0, type = 'workers'

  useEffect(() => {
    const timeout = setTimeout(() => updateRevealing(false), 2000)
    return () => clearTimeout(timeout)
  }, [ revealing ])

  if (! reveal) {
    return <></>
  }

  const asset = reveal.assets(type)[index] as Worker

  const handleNextClick = () => {
    reveal.registerReveal(type, reveal.assets(type)[index].id)
    updateRevealing(true)
  }

  const handleSkipAllClick = () => {
    reveal.assets(type).map(asset => asset.id).forEach(id => reveal.registerReveal(type, id))
    updateContainerClasses(classNames(styles.container, styles.hidden))
    updateDone(true)
  }

  const handleNotifierClick = () => {
    updateRevealing(true)
    updateContainerClasses(classNames(styles.container, styles.visible))
  }

  return (
    <div className={containerClasses}>
      <div className={styles.notifier}>
        <Notifier type={type} onClick={handleNotifierClick}/>
      </div>

      <Modal onOverlayClick={() => { } } visible={! done}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1  className={styles.title}>Workers Reveal</h1>
            <div className={styles.status}>{index + 1} / {reveal.count(type)}</div>
          </div>

          <div className={styles.content}>
            {
              reveal.hasAssets(type) &&
              <>
                <div className={styles.id}>
                  { revealing ? <Hex/> : <Shortener data={reveal.assets(type)[index].id}/> }
                </div>
                <div className={styles.power}>
                  { revealing ? <Power/> : `${asset.power} MP`.padStart(6, '0') }
                </div>
                <div className={styles.stars}>
                  { revealing ? <Rarity/> : <RevealedRarity count={reveal.assets(type)[index].rarity}/> }
                </div>
              </>
            }
          </div>

          <div className={styles.footer}>
            <div className={styles.skip}>
              <button onClick={handleSkipAllClick}>Skip All</button>
            </div>
            <div className={styles.actions}>
              {
                (index + 1 < reveal.count(type))
                ? <button onClick={handleNextClick} disabled={revealing}>Next</button>
                : <button onClick={handleSkipAllClick} disabled={revealing}>Done</button>
              }
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Reveal
