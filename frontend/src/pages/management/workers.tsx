import type { NextPage } from 'next'
import styles from './workers.module.css'

import { repeat } from '@Helper/repeat'
import { useGame, Worker } from '@Context/Game'

import Shortener from '@Component/Shortener'
import PageContainer from '@Component/PageContainer'
import Stars from '@Component/Stars'
import Balance from '@Component/Balance'
import Mint from '@Component/Mint'
import Heading from '@Component/Heading'
import RarityFilter from '@Component/RarityFilter'
import { useWorkers } from '@Hook/Workers'
import { useSelection } from '@Hook/Selection'
import Selection from '@Component/Selection'
import EmptyListInfo from '@Component/EmptyListInfo'
import Padding from '@Component/Padding'
import Icon from '@Component/Icon'
import Reveal from '@Component/Workers/Reveal'


const Workers: NextPage = () => {
  const { game, account, mintWorker, burnWorker, sellWorker } = useGame()
  const { rarity, emptyRarities, changeRarity, workers, count, power } = useWorkers()
  const selection = useSelection()

  if (! game || ! account) {
    return <></>
  }

  function massBurn() {
    if (selection.assets.length === 0) {
      return
    }

    selection.assets.forEach(asset => {
      burnWorker(asset.id)
    })

    selection.reset()
  }

  function massSell() {
    if (selection.assets.length === 0) {
      return
    }

    selection.assets.forEach(asset => {
      sellWorker(asset.id)
    })

    selection.reset()
  }

  function toggleSelection() {
    selection.toggleAll(workers)
  }

  function workerClassName(worker: Worker): string {
    return selection.assets.includes(worker) ? [ styles.worker, styles.selected ].join(' ') : styles.worker
  }

  const list = workers.map((worker) => (
    <div className={workerClassName(worker)} key={worker.id} onClick={() => selection.toggle(worker)}>
      <div className={styles.id}>
        <Shortener data={worker.id}/>
      </div>
      <div className={styles.stars}><Stars count={worker.rarity}/></div>
      <div>{worker.power} MP</div>
      <div className={styles.selection}>
        {selection.assets.includes(worker) ? <Icon name='CheckboxChecked'/> : <Icon name='CheckboxBlank'/>}
      </div>
    </div>
  ))

  return (
    <PageContainer>
      <Reveal/>

      <Padding vertical={false}>
        <Balance value={account.balance} />
        <Heading size={1}>Workers</Heading>
        <table className={styles.report}>
          <thead>
            <tr>
              <th>Count</th>
              <th>Power</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{count}</td>
              <td>{power} MP</td>
            </tr>
          </tbody>
        </table>

        <Mint balance={account.balance} onMintClick={(count: number) => repeat(count, mintWorker)}/>

        <div className={styles.controls}>
          <RarityFilter initial={rarity} onRarityChange={(rarity: number) => changeRarity(rarity)} empty={emptyRarities}/>
          <Selection selection={selection.assets} onBurnClick={massBurn} onSellClick={massSell} onSelectAllClick={toggleSelection}/>
        </div>
      </Padding>

      {list.length === 0 && <EmptyListInfo>
          Your workers list is empty right now.
          <br />
          Try to mint some.
        </EmptyListInfo>
      }

      <div className={styles.workers}>
        {list}
      </div>
    </PageContainer>
  )
}

export default Workers
