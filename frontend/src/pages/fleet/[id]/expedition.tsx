import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styles from './expedition.module.css'
import { useGame } from '@Context/Game'
import Shortener from '@Component/Shortener'
import PageContainer from '@Component/PageContainer'
import Balance from '@Component/Balance'
import Stars from '@Component/Stars'
import Heading from '@Component/Heading'
import { MainActionButton } from '@Component/Action'
import { useState } from 'react'
import Padding from '@Component/Padding'


const Expedition: NextPage = () => {
  const router = useRouter()
  const { game, account, registerExpedition, successRate } = useGame()
  const [ expedition, updateExpedition ] = useState(null)

  if (! game || ! account) {
    return null
  }

  const { id } = router.query
  const { fleets, balance } = account

  const fleet = fleets.find((fleet) => fleet.id === id)

  if (! fleet) {
    return <></>
  }

  function fleetExausted(id: string) {
    const cooldown = 1000 * (60 * 5)

    const expeditions = account.expeditions
      .filter(expedition => expedition.fleet.id === id)
      .filter(expedition => expedition.moment + cooldown > Date.now())

    return expeditions.length > 0
  }

  if (fleetExausted(fleet.id)) {
    router.push('/management/expeditions')
  }

  function onPlanetClick(planet: any) {
    const chances = successRate(fleet, planet)
    updateExpedition({planet, chances, reward: planet.reward})
  }

  function onRegisterClick() {
    registerExpedition(fleet, expedition.planet)
    router.push('/management/expeditions')
  }

  const options = game.planets.map((planet, index) => {
    const disabled = expedition || fleet.power < planet.required.power || fleet.fuel < planet.required.fuel

    return (
      <button key={planet.id} className={styles.planet} disabled={disabled} onClick={() => onPlanetClick(planet)}>
        <div>
          {planet.id}
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th>Power</th>
                <th>Fuel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{fleet.power} / {planet.required.power}</td>
                <td>{fleet.fuel} / {planet.required.fuel}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.planet__second}>
          <table>
              <thead>
                <tr>
                  <th>Chances</th>
                  <th>Reward</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{successRate(fleet, planet)}%</td>
                  <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(planet.reward / 100)}</td>
                </tr>
              </tbody>
            </table>
        </div>
      </button>
    )
  })

  return (
    <PageContainer>
      <Balance value={balance}></Balance>
      <Padding vertical={false}>
        <div className={styles.fleet}>
          <table>
            <thead>
              <tr>
                <th>Fleet</th>
                <th>Rank</th>
                <th>Power</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.id}>
                  <Shortener data={fleet.id}/>
                </td>
                <td><Stars count={fleet.rank}/></td>
                <td>{fleet.power} MP</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.expeditions}>
          <Heading size={2}>Expedition</Heading>
          <div className={styles.expedition}>
            <table>
              <thead>
                <tr>
                  <th>Planet</th>
                  <th>Chances</th>
                  <th>Reward</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expedition && (
                  <tr>
                    <td>{expedition.planet.id}</td>
                    <td>{expedition.chances}%</td>
                    <td>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expedition.planet.reward / 100)}</td>
                    <td>
                      <button onClick={() => updateExpedition(null)}>Cancel</button>
                    </td>
                  </tr>
                )}
                {! expedition && (
                  <tr>
                    <td colSpan={4}> </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                {! expedition && (
                <tr>
                  <td colSpan={4}>
                    <p>Click on a planet to select an expedition.</p>
                  </td>
                </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>
      </Padding>

      <div className={styles.action}>
        <MainActionButton onclick={onRegisterClick} disabled={! expedition}>Execute Expedition</MainActionButton>
      </div>

      <div className={styles.planets}>
        <Heading size={2}>  Planets</Heading>
        <div>
          {options}
        </div>
      </div>
    </PageContainer>
  )
}

export default Expedition
