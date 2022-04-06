import { Spaceship, Worker, useGame } from '@Context/Game'
import { useCallback, useEffect, useState } from 'react'

export function useReveal() {
  const context = useGame()

  const [ spaceships, updateSpaceships ] = useState([] as Spaceship[])
  const [ workers, updateWorkers ] = useState([] as Worker[])


  useEffect(() => {
    if (! context.account) {
      return
    }

    const { reveal } = context.account

    updateSpaceships(reveal.spaceships)
    updateWorkers(reveal.workers)

  }, [ context ])

  const count = useCallback((type: string): number => {
    switch (type) {
      case 'spaceships':
        return spaceships.length

      case 'workers':
        return workers.length

      default:
        return 0
    }
  }, [ spaceships, workers ])

  const hasAssets = useCallback((type: string): boolean => {
    switch (type) {
      case 'spaceships':
        return spaceships.length !== 0

      case 'workers':
        return workers.length !== 0

      default:
        return false
    }
  }, [ spaceships, workers ])

  const assets = useCallback((type: string): Spaceship[] | Worker[] => {
    switch (type) {
      case 'spaceships':
        return spaceships

      case 'workers':
        return workers
    }
  }, [ spaceships, workers ])

  const registerReveal = useCallback((type: string, id: string): void => {
    switch (type) {
      case 'spaceships':
        return context.registerSpaceshipReveal(id)

      case 'workers':
        return context.registerWorkerReveal(id)
    }
  }, [ spaceships, workers ])

  return {
    hasAssets, assets, count, registerReveal
  }
}
