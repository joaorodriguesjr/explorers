import { useGame } from '@Context/Game'
import { useCallback, useEffect, useState } from 'react'

interface Spaceship {
  id: string, rarity: number
}

interface Worker {
  id: string, rarity: number, power: number
}

const data = {
  selectable: {
    spaceships: [] as Spaceship[],
    workers: [] as Worker[],
  },
  selected: {
    spaceships: [] as Spaceship[],
    workers: [] as Worker[],
  },
}

function sortAssets() {
  data.selectable.spaceships.sort((a, b) => b.rarity - a.rarity)
  data.selectable.workers.sort((a, b) => b.power - a.power)

  data.selected.spaceships.sort((a, b) => b.rarity - a.rarity)
  data.selected.workers.sort((a, b) => b.power - a.power)
}

export function useSelectable(fleet: string = null) {
  const [ state, update ] = useState(0)
  const { account } = useGame()


  useEffect(() => {
    if (! account) {
      return
    }

    if (fleet) {
      const { spaceships, workers } = account.fleets.find(({ id }) => id === fleet)
      data.selected = { spaceships, workers }
    } else {
      data.selected = { spaceships: [], workers: [] }
    }

    data.selectable.spaceships = [...account.spaceships]
    data.selectable.workers = [...account.workers]

    sortAssets()
    update(Date.now())
  }, [account])

  const selectSpaceship = useCallback((spaceship: Spaceship) => {
    data.selectable.spaceships = data.selectable.spaceships.filter(({ id }) => id !== spaceship.id)
    data.selected.spaceships.push(spaceship)
    update(Date.now())
  }, [])

  const selectWorker = useCallback((worker: Worker) => {
    data.selectable.workers = data.selectable.workers.filter(({ id }) => id !== worker.id)
    data.selected.workers.push(worker)
    update(Date.now())
  }, [])

  const deselectSpaceship = useCallback((spaceship: Spaceship) => {
    data.selectable.spaceships.push(spaceship)
    data.selected.spaceships = data.selected.spaceships.filter(({ id }) => id !== spaceship.id)
    update(Date.now())
  }, [])

  const deselectWorker = useCallback((worker: Worker) => {
    data.selectable.workers.push(worker)
    data.selected.workers = data.selected.workers.filter(({ id }) => id !== worker.id)
    update(Date.now())
  }, [])

  return {
    selectable: {...data.selectable}, selected: {...data.selected},
    selectSpaceship, selectWorker,  deselectSpaceship, deselectWorker,
  }
}
