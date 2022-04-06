import type { NextPage } from 'next'
import styles from '../fleet.module.css'
import { useGame } from '@Context/Game'
import Tabs from '@Component/Tabs'
import { useSelectable } from '@Hook/Selectable'
import PageContainer from '@Component/PageContainer'
import Balance from '@Component/Balance'
import { useRouter } from 'next/router'
import Heading from '@Component/Heading'
import Stars from '@Component/Stars'
import Image from 'next/image'
import Padding from '@Component/Padding'
import Icon from '@Component/Icon'

const Fleet: NextPage = () => {
  const { game, account, calculateRank, updateFleet } = useGame()
  const router = useRouter()
  const id = router.query.id as string

  const {
    selectable, selected,
    selectSpaceship, selectWorker,  deselectSpaceship, deselectWorker,
  } = useSelectable(id ? id : null)

  if (! game || ! account) {
    return <></>
  }

  const handleActionClick = () => {
    updateFleet(id, selected.spaceships, selected.workers)
    router.push('/management/fleets')
  }

  const spaceships = selectable.spaceships.map(({ id, rarity }) => {
    const disabled = selected.spaceships.length >= 10

    return <div className={styles.spaceship} key={id}>
      <div>
        <Stars count={rarity}/>
      </div>
      <button onClick={() => selectSpaceship({id, rarity})} disabled={disabled}>
        <Icon name={'Plus'}/>
      </button>
    </div>
  })

  const workers = selectable.workers.map(({ id, rarity, power }) => {
    const disabled = selected.workers.length >= selected.spaceships.reduce((acc, { rarity }) => acc + rarity, 0)

    return <div className={styles.worker} key={id}>
      <div>
        <Stars count={rarity}/>
      </div>
      <div>{power} MP</div>
      <button onClick={() => selectWorker({ id, rarity, power })} disabled={disabled}>
        <Icon name={'Plus'}/>
      </button>
    </div>
  })

  return (
    <PageContainer>
      <Balance value={account.balance}/>
      <Padding vertical={false} grow={true}>
        <Heading size={1}>Fleet Management</Heading>
        <table className={styles.report}>
          <thead>
            <tr>
              <th>Spaceships</th>
              <th>Workers</th>
              <th>Rank</th>
              <th>Power</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selected.spaceships.length}/10</td>
              <td>{selected.workers.length}/{selected.spaceships.reduce((acc, { rarity }) => acc + rarity, 0)}</td>
              <td>
                <Stars count={calculateRank(selected.spaceships)}/>
              </td>
              <td>{selected.workers.reduce((acc, { power }) => acc + power, 0)} MP</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.action}>
          <button onClick={handleActionClick} disabled={selected.workers.reduce((acc, { power }) => acc + power, 0) <= 0}>
            Update
          </button>
        </div>

        <Tabs labels={['Available', 'Selected']} activeTab={1}>
          <div className={styles.selectable}>
            <div>
              <Heading size={3}>Spaceships</Heading>
              <div className={styles.selectable__spaceships}>
                {spaceships}
              </div>
            </div>

            <div>
              <Heading size={3}>Workers</Heading>
              <div className={styles.selectable__workers}>
                {workers}
              </div>
            </div>
          </div>

          <div className={styles.selected}>
            <div>
              <Heading size={3}>Spaceships</Heading>
              <div className={styles.selected__spaceships}>
                {
                  selected.spaceships.map(({ id, rarity }) => {
                    const disabled = selected.workers.length !== 0 && selected.workers.length > selected.spaceships.reduce((acc, { rarity }) => acc + rarity, 0) - rarity

                    return <div className={styles.spaceship} key={id}>
                      <div>
                        <Stars count={rarity}/>
                      </div>
                      <button onClick={() => deselectSpaceship({id, rarity})} disabled={disabled}>
                        <Icon name={'Minus'}/>
                      </button>
                    </div>
                  })
                }
              </div>
            </div>

            <div className={styles.selected__workers}>
              <Heading size={3}>Workers</Heading>
              <div>
                {
                  selected.workers.map(({ id, rarity, power }) => {

                    return <div className={styles.worker} key={id}>
                      <div>
                        <Stars count={rarity}/>
                      </div>
                      <div>{power} MP</div>
                      <button onClick={() => deselectWorker({id, rarity, power})} >
                        <Icon name={'Minus'}/>
                      </button>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </Tabs>
      </Padding>
    </PageContainer>
  )
}

export default Fleet
