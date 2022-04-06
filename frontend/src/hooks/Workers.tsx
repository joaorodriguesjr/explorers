import { useGame, Worker } from '@Context/Game'
import { useCallback, useEffect, useState } from 'react'

export function useWorkers() {
  const rarities = [ 1, 2, 3, 4, 5 ]

  const [ emptyRarities , updateEmptyRarities ] = useState([] as number[])

  const [ rarity, updateRarity ] = useState(0)
  const [ count , updateCount  ] = useState(0)
  const [ power , updatePower  ] = useState(0)

  const [ workers, updateWorkers ] = useState([] as Worker[])
  const context = useGame()

  useEffect(() => {
    if (! context.game || ! context.account) {
      return
    }

    const emptyRarities = [] as number[]

    rarities.forEach(rarity => {
      const list = context.account.workers.filter(worker => worker.rarity === rarity)

      if (list.length !== 0) {
        return
      }

      emptyRarities.push(rarity)
    })

    updateEmptyRarities(emptyRarities)

    const list = context.account.workers
      .filter(worker => (rarity !== 0) ? worker.rarity === rarity : true)

    updatePower(list.reduce((acc, { power }) => acc + power, 0))
    updateCount(list.length)
    updateWorkers(list)
  }, [ context, rarity ])

  const changeRarity = useCallback((rarity: number) => {
    updateRarity(rarity)
  }, [])

  return {
    emptyRarities,
    rarity, changeRarity,
    workers, count, power,
  }
}
