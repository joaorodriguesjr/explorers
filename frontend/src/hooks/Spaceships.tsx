import { useGame, Spaceship } from '@Context/Game'
import { useCallback, useEffect, useState } from 'react'

export function useSpaceships() {
  const rarities = [ 1, 2, 3, 4, 5 ]

  const [ emptyRarities , updateEmptyRarities ] = useState([] as number[])

  const [ rarity   , updateRarity   ] = useState(0)
  const [ count    , updateCount    ] = useState(0)
  const [ capacity , updateCapacity ] = useState(0)

  const [ spaceships, updateSpaceships ] = useState([] as Spaceship[])
  const context = useGame()

  useEffect(() => {
    if (! context.account) {
      return
    }

    const emptyRarities = [] as number[]

    rarities.forEach(rarity => {
      const list = context.account.spaceships.filter(spaceship => spaceship.rarity === rarity)

      if (list.length !== 0) {
        return
      }

      emptyRarities.push(rarity)
    })

    updateEmptyRarities(emptyRarities)

    const list = context.account.spaceships
      .filter(spaceship => (rarity !== 0) ? spaceship.rarity === rarity : true)

    updateCapacity(list.reduce((acc, { rarity }) => acc + rarity, 0))
    updateCount(list.length)
    updateSpaceships(list)
  }, [ context, rarity ])

  const changeRarity = useCallback((rarity: number) => {
    updateRarity(rarity)
  }, [])

  return {
    emptyRarities,
    rarity, changeRarity,
    spaceships, count, capacity,
  }
}
