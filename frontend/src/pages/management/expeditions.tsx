import type { NextPage } from 'next'
import styles from './expeditions.module.css'
import { useGame } from '@Context/Game'
import PageContainer from '@Component/PageContainer'
import Balance from '@Component/Balance'
import Shortener from '@Component/Shortener'
import Stars from '@Component/Stars'
import Link from 'next/link'
import Heading from '@Component/Heading'
import Timer from '@Component/Timer'
import { useRouter } from 'next/router'
import Time from '@Component/Time'
import Padding from '@Component/Padding'
import Icon from '@Component/Icon'

// const COLLDOWN_TIME = 1000 * (60 * 60 * 24)
const COLLDOWN_TIME = 1000 * (60 * 5)

const Expeditions: NextPage = () => {
  const { account } = useGame()
  const router = useRouter()

  if (! account) {
    return <></>
  }

  const ready = account.fleets.filter(fleet => {
    return fleet.contract > 0 && fleet.fuel > 0
  })

  function fleetExausted(id: string) {
    const cooldown = COLLDOWN_TIME

    const expeditions = account.expeditions
      .filter(expedition => expedition.fleet.id === id)
      .filter(expedition => expedition.moment + cooldown > Date.now())

    return expeditions.length > 0
  }

  function lastExpedition(id: string): number {
    const expeditions = account.expeditions
      .filter(expedition => expedition.fleet.id === id)

    return expeditions[expeditions.length - 1].moment
  }

  const expeditionsList = account.expeditions
    .filter(expedition => expedition.moment + (1000 * 60 * 60 * 24) > Date.now())
    .map(expedition => (
      <tr key={expedition.id}>
        <td className={styles.id}>
          <Shortener data={expedition.fleet.id}/>
        </td>
        <td>{expedition.planet.id}</td>
        <td><Time timestamp={expedition.moment}/></td>
        <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumIntegerDigits: 2 }).format(expedition.reward / 100)}</td>
        {
          (expedition.toss <= expedition.chances)
            ? <td className={styles.success}><Icon name={'Info'}/></td>
            : <td className={styles.fail}><Icon name={'Info'}/></td>
        }
      </tr>
    ))

  const list = ready.map(({ id, rank, power }) => {
    return (
      <tr key={id}>
        <td className={styles.id}>
          <Shortener data={id}/>
        </td>
        <td className={styles.stars}><Stars count={rank}/></td>
        <td>{power} MP</td>
        {
          fleetExausted(id)
            ? <td className={styles.cooldown}>
                <Timer start={lastExpedition(id)} duration={COLLDOWN_TIME} onTimeout={() => router.reload()}/>
            </td>
            : <td>
              <Link href={`/fleet/${id}/expedition`}>Dispatch</Link>
            </td>
        }
      </tr>
    )
  })


  return (
    <PageContainer>
      <Padding vertical={false}>
        <Balance value={account.balance}></Balance>
        <div className={styles.fleets}>
          <Heading size={2}>Fleets Ready</Heading>
          <table>
              <thead>
                <tr>
                  <th>Fleet</th>
                  <th>Rank</th>
                  <th>Power</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list}
              </tbody>
              <tfoot>
                {list.length === 0 && <tr>
                  <td colSpan={4}>
                    No fleets to go on expeditions! <br />
                    Make sure all your fleets has a contract and fuel.
                  </td>
                </tr>}
              </tfoot>
            </table>
        </div>
      </Padding>

      <Heading size={2}>Expeditions</Heading>
      <div className={styles.report}>
        <table>
            <thead>
              <tr>
                <th>Fleet</th>
                <th>Planet</th>
                <th>Date Time</th>
                <th>Reward</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {expeditionsList}
            </tbody>
            <tfoot>
              {expeditionsList.length === 0 && <tr>
                <td colSpan={5}>
                  No expeditions executed today.
                </td>
              </tr>}
            </tfoot>
          </table>
      </div>
    </PageContainer>
  )
}

export default Expeditions
