import type { NextPage } from 'next'
import styles from './fleets.module.css'
import { useGame } from '@Context/Game'
import Link from 'next/link'
import Shortener from '@Component/Shortener'
import Stars from '@Component/Stars'
import PageContainer from '@Component/PageContainer'
import Balance from '@Component/Balance'
import Heading from '@Component/Heading'
import Image from 'next/image'
import Padding from '@Component/Padding'
import Icon from '@Component/Icon'

const Fleets: NextPage = () => {
  const { game, account, payFleetContract, buyFleetfuel } = useGame()

  if (! game || ! account) {
    return <></>
  }

  const { balance, fleets } = account
  const power = fleets.reduce((acc, fleet) => acc + fleet.power, 0)
  const count = fleets.reduce((acc, fleet) => acc + 1, 0)

  const actionClass = `${styles.action} ${(balance < 1000) ? styles.disabled : ''}`

  const list = fleets.map(({ id, power, rank, contract, fuel }) => {
    return <div className={styles.fleet} key={id}>
      <Link href={`/management/fleet/${id}`} passHref>
        <div className={styles.description}>
            <div className={styles.wrench}>
              <Icon name={'Wrench'}/>
            </div>
            <div className={styles.id}><Shortener data={id}/></div>
            <div>{power} MP</div>
            <div className={styles.stars}><Stars count={rank}/></div>
        </div>
      </Link>

      <div className={styles.status}>
        <table>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Fuel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{contract} {contract !== 1 ? 'days' : 'day'}</td>
              <td>{fuel} {fuel !== 1 ? 'units' : 'unit'}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <button onClick={() => payFleetContract(id)}>Pay</button>
              </td>
              <td>
                <button onClick={() => buyFleetfuel(id)}>Buy</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  })

  return (
    <PageContainer>
      <Padding vertical={false}>
        <Balance value={balance} />
        <Heading size={1}>Fleets</Heading>
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
        <div className={actionClass}>
          <Link href={'/management/fleet'}>Create Fleet</Link>
        </div>
      </Padding>

      <div className={styles.fleets}>{list}</div>
    </PageContainer>
  )
}

export default Fleets
