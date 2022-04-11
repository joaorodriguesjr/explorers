import type { NextPage } from 'next'
import styles from './spaceships.module.css'
import { repeat } from '@Helper/library'
import { Spaceship, useGame } from '@Context/Game'
import Shortener from '@Component/Shortener'
import Stars from '@Component/Stars'
import PageContainer from '@Component/PageContainer'
import Balance from '@Component/Balance'
import Mint from '@Component/Mint'
import Heading from '@Component/Heading'
import Padding from '@Component/Padding'
import Selection from '@Component/Selection'
import { useSelection } from '@Hook/Selection'
import { useSpaceships } from '@Hook/Spaceships'
import Icon from '@Component/Icon'
import RarityFilter from '@Component/RarityFilter'
import EmptyListInfo from '@Component/EmptyListInfo'
import Reveal from '@Component/Spaceships/Reveal'

const Spaceships: NextPage = () => {
  const { game, account, mintSpaceship, burnSpaceship, sellSpaceship } = useGame()
  const { rarity, emptyRarities, changeRarity, spaceships, count, capacity } = useSpaceships()
  const selection = useSelection()

  if (! game || ! account) {
    return <></>
  }

  function massBurn() {
    if (selection.assets.length === 0) {
      return
    }

    selection.assets.forEach(asset => {
      burnSpaceship(asset.id)
    })

    selection.reset()
  }

  function massSell() {
    if (selection.assets.length === 0) {
      return
    }

    selection.assets.forEach(asset => {
      sellSpaceship(asset.id)
    })

    selection.reset()
  }

  function toggleSelection() {
    selection.toggleAll(spaceships)
  }

  function spaceshipClassName(spaceship: Spaceship): string {
    return selection.assets.includes(spaceship) ? [ styles.spaceship, styles.selected ].join(' ') : styles.spaceship
  }

  const list = spaceships.map((spaceship) => {
    return <div className={spaceshipClassName(spaceship)} key={spaceship.id} onClick={() => selection.toggle(spaceship)}>
      <div className={styles.id}><Shortener data={spaceship.id}/></div>
      <div><Stars count={spaceship.rarity}/></div>
      <div className={styles.selection}>
        {selection.assets.includes(spaceship) ? <Icon name='CheckboxChecked'/> : <Icon name='CheckboxBlank'/>}
      </div>
    </div>
  })

  return (
    <PageContainer>
      <Reveal/>

      <Padding vertical={false}>
        <Balance value={account.balance} />
        <Heading size={1}>Spaceships</Heading>
        <table className={styles.report}>
          <thead>
            <tr>
              <th>Count</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{count}</td>
              <td>{capacity} <small>workers</small></td>
            </tr>
          </tbody>
        </table>

        <Mint balance={account.balance} onMintClick={(count: number) => repeat(count, mintSpaceship)}></Mint>

        <div className={styles.controls}>
          <RarityFilter initial={rarity} onRarityChange={(rarity: number) => changeRarity(rarity)} empty={emptyRarities}/>
          <Selection selection={selection.assets} onBurnClick={massBurn} onSellClick={massSell} onSelectAllClick={toggleSelection}/>
        </div>
      </Padding>

      {list.length === 0 && <EmptyListInfo>
          Your spaceships list is empty right now.
          <br />
          Try to mint some.
        </EmptyListInfo>
      }

      <div className={styles.spaceships}>
        {list}
      </div>
    </PageContainer>
  )
}

export default Spaceships
