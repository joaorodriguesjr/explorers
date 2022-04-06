import { FunctionComponent, createContext, useCallback, useContext, useState, useEffect } from 'react'
import { random, repeat } from '@Helper/library'
import { encode, decode } from '@Helper/json'
import { generate } from '@Helper/id'

const rarities = [ 1 , 2 , 3 , 4, 5 ]
const weights  = [ 44, 35, 15, 5, 1 ]
const powers   = [
  { min: 15, max: 50 }, { min: 50, max: 100 }, { min: 100, max: 150 }, { min: 150, max: 200 }, { min: 200, max: 255 }
]

const rates: number[] = [
  85, 88, 91, 93, 97,
  83, 86, 89, 91, 95,
  81, 84, 87, 89, 93,
  79, 82, 85, 87, 91,
  77, 80, 83, 85, 89,
  75, 78, 81, 83, 87,
  73, 76, 79, 81, 85,
  71, 74, 77, 79, 83,
  69, 72, 75, 77, 81,
  67, 70, 73, 75, 79,

  60, 65, 67, 71, 74,
  58, 63, 65, 69, 72,
  56, 61, 63, 67, 70,
  54, 59, 61, 65, 68,
  52, 57, 59, 63, 66,
  50, 55, 57, 61, 64,
  48, 53, 55, 59, 62,
  46, 51, 53, 57, 60,
  44, 49, 51, 55, 58,
  42, 47, 49, 53, 56,

  41, 43, 47, 52, 55,
  41, 43, 47, 52, 55,
  41, 43, 47, 52, 55,
  41, 43, 47, 52, 55,
  41, 43, 47, 52, 55,

  39, 40, 45, 50, 53,
  39, 40, 45, 50, 53,
  39, 40, 45, 50, 53,
  39, 40, 45, 50, 53,
  39, 40, 45, 50, 53,
]

const bonusCap = [
  97,  97,  97,  97,  97,  97,  97,  97,  97,  97,
  97,  97,  97,  97,  97,  97,  97,  97,  97,  97,
  93,  93,  93,  93,  93,
  91,  91,  91,  91,  91,
]



function randomRarity(): number {
  const options = weights.map((weight, index) => Array(weight).fill(rarities[index]))
    .reduce((previous, current) => previous.concat(current), [])

  return options[random(0, options.length - 1)]
}

function randomPower(rarity: number): number {
  const { min, max } = powers[rarity - 1]
  return random(min, max)
}

function calculateRank(spaceships: Spaceship[]): number {
  const rarities = [] as { count: number, rarity: number }[]

  spaceships.forEach(({ rarity }) => {
    if (! rarities[rarity]) {
      rarities[rarity] = { count: 0, rarity }
    }

    rarities[rarity].count += 1
  })

  return rarities.reduce((previous, current) => (
    (previous.count > current.count) ? previous : current
  ), { count: 0, rarity: 0 }).rarity
}


export interface Entity {
  id: string
}

export interface Planet extends Entity {
  chances: number[], reward: number,
  required: { power: number, fuel: number }
}

export interface Expedition extends Entity {
  planet: Planet, fleet: Fleet,
  moment: number, chances: number, reward: number, toss: number
}

export interface Asset extends Entity {
  rarity: number
}

export interface Spaceship extends Asset {
  rarity: number
}

export interface Worker extends Asset {
  power: number
}

export interface Fleet extends Entity {
  rank: number, power: number,
  contract: number, fuel: number,
  workers: Worker[], spaceships: Spaceship[]
}

export interface Account extends Entity {
  wallet: string, balance: number

  spaceships: Spaceship[], workers: Worker[]

  fleets: Fleet[], expeditions: Expedition[]

  reveal: { spaceships: Spaceship[], workers: Worker[] }
}

export interface Game {
  mint: number, burn: number

  planets: Planet[]
}

let game: Game = null, account: Account = null
const planets: Planet[] = []
let multiplier = 1

repeat(30, (index: number) => {
  const id = (index + 1 < 10) ? `0${index + 1}` : `${index + 1}`

  multiplier = (index + 1) % 5 === 0 ? multiplier + 0.1 : multiplier

  planets.push({
    id,
    chances: rates.slice(index * 5, index * 5 + 5),
    reward: 100 * Math.round((index + 1) * multiplier),

    required: {
      power: 100 * index + 100,
      fuel: (100 * index + 100) * 0.10,
    }
  })

  return
})

export const GameContext = createContext(null)

export const GameProvider: FunctionComponent = ({ children }) => {
  const [ state, update ] = useState(0)

  const initialGame: Game = {
    mint: 1000, burn: 200, planets
  }

  const initialAccount: Account = {
    id: generate(), wallet: '', balance: 5000000,
    spaceships: [], workers: [], fleets: [], expeditions: [],
    reveal: { spaceships: [], workers: [] }
  }

  useEffect(() => {
    if (! localStorage) {
      game = initialGame
      update(Date.now())
      return
    }

    if (! localStorage.getItem('game') || ! localStorage.getItem('account')) {
      localStorage.setItem('game', encode(initialGame))
      localStorage.setItem('account', encode(initialAccount))
    }

    if (game === null || account === null) {
      game = decode(localStorage.getItem('game'))
      account = decode(localStorage.getItem('account'))
      update(Date.now())
      return
    }

    localStorage.setItem('game', encode(game))
    localStorage.setItem('account', encode(account))
  }, [ state ])



  const mintSpaceship = useCallback(() => {
    const rarity = randomRarity()
    const id = generate()
    const spaceship = { id, rarity }

    account.reveal.spaceships.push(spaceship)
    account.balance -= game.mint

    update(Date.now())
  }, [])



  const registerSpaceshipReveal = useCallback((id: string) => {
    const spaceship = account.reveal.spaceships.find((spaceship) => spaceship.id === id)

    if (! spaceship) {
      return
    }

    account.reveal.spaceships = account.reveal.spaceships.filter((spaceship) => spaceship.id !== id)
    account.spaceships.push(spaceship)
    update(Date.now())
  }, [])



  const burnSpaceship = useCallback((id: string) => {
    const spaceship = account.spaceships.find((spaceship) => spaceship.id === id)

    if (! spaceship) {
      return
    }

    account.spaceships = account.spaceships.filter((spaceship) => spaceship.id !== id)
    account.balance += game.burn
    update(Date.now())
  }, [])



  const sellSpaceship = useCallback((id: string) => {
    const spaceship = account.spaceships.find((spaceship) => spaceship.id === id)

    if (! spaceship) {
      return
    }

    const weight = weights[spaceship.rarity - 1]
    const price = Math.floor(Math.pow(2, spaceship.rarity) / 4 * (100 - weight) * game.mint / 100)

    account.balance += price
    account.spaceships = account.spaceships.filter((spaceship) => spaceship.id !== id)
    update(Date.now())
  }, [])



  const mintWorker = useCallback(() => {
    const rarity = randomRarity()
    const id = generate()
    const power = randomPower(rarity)
    const worker = { id, rarity, power }

    account.reveal.workers.push(worker)
    account.balance -= game.mint

    update(Date.now())
  }, [])



  const registerWorkerReveal = useCallback((id: string) => {
    const worker = account.reveal.workers.find((worker) => worker.id === id)

    if (! worker) {
      return
    }

    account.reveal.workers = account.reveal.workers.filter((worker) => worker.id !== id)
    account.workers.push(worker)
    update(Date.now())
  }, [])



  const burnWorker = useCallback((id: string) => {
    const worker = account.workers.find((worker) => worker.id === id)

    if (! worker) {
      return
    }

    account.balance += game.burn
    account.workers = account.workers.filter((worker) => worker.id !== id)
    update(Date.now())
  }, [])



  const sellWorker = useCallback((id: string) => {
    const worker = account.workers.find((worker) => worker.id === id)

    if (! worker) {
      return
    }

    const power = powers[worker.rarity - 1]
    const price01 = Math.round(power.max - power.min - worker.power)
    const weight = weights[worker.rarity - 1]
    const price02 = Math.pow(2, worker.rarity) / 4 * (100 - weight) * game.mint / 100
    const price = Math.abs(price01 - price02)

    account.balance += price
    account.workers = account.workers.filter((worker) => worker.id !== id)
    update(Date.now())
  }, [])



  const createFleet = useCallback((spaceships: Spaceship[], workers: Worker[]) => {
    const id = generate()
    const rank = calculateRank(spaceships)
    const contract = 0, fuel = 0

    const power = workers.reduce((previous, current) => previous + current.power, 0)
    const fleet = { id, rank, power, contract, fuel, workers, spaceships }

    account.spaceships = account.spaceships.filter((spaceship) => ! spaceships.find((assigned) => spaceship.id === assigned.id))

    account.workers = account.workers.filter((worker) => ! workers.find((assigned) => worker.id === assigned.id))

    account.fleets.push(fleet)
    account.balance -= game.mint

    update(Date.now())
  }, [])



  const updateFleet = useCallback((id: string, spaceships: Spaceship[], workers: Worker[]) => {
    console.log(account.workers, account.spaceships)
    const fleet = account.fleets.find((fleet) => fleet.id === id)

    const addedSpaceships = spaceships.filter((spaceship) => account.spaceships.find((assigned) => assigned.id === spaceship.id))
    const removedSpaceships = fleet.spaceships.filter((spaceship) => ! spaceships.find((assigned) => assigned.id === spaceship.id))

    const addedWorkers = workers.filter((worker) => account.workers.find((assigned) => assigned.id === worker.id))
    const removedWorkers = fleet.workers.filter((worker) => ! workers.find((assigned) => assigned.id === worker.id))

    if (addedSpaceships.length > 0) {
      account.spaceships = account.spaceships.filter((spaceship) => ! addedSpaceships.find((assigned) => spaceship.id === assigned.id))
    }

    if (removedSpaceships.length > 0) {
      account.spaceships = account.spaceships.concat(removedSpaceships)
    }

    if (addedWorkers.length > 0) {
      account.workers = account.workers.filter((worker) => ! addedWorkers.find((assigned) => worker.id === assigned.id))
    }

    if (removedWorkers.length > 0) {
      account.workers = account.workers.concat(removedWorkers)
    }

    fleet.spaceships = spaceships
    fleet.workers = workers
    fleet.rank = calculateRank(fleet.spaceships)
    fleet.power = workers.reduce((previous, current) => previous + current.power, 0)

    account.balance -= game.mint
    update(Date.now())
  }, [])



  const payFleetContract = useCallback((id: string) => {
    const fleet = account.fleets.find((fleet) => fleet.id === id)

    if (! fleet) {
      return
    }

    const days = 7
    const payment = fleet.workers.length * days * 10

    if (payment > account.balance) {
      return alert('Not enough balance.')
    }

    account.balance -= payment
    fleet.contract += days
    update(Date.now())
  }, [])



  const buyFleetfuel = useCallback((id: string) => {
    const fleet = account.fleets.find((fleet) => fleet.id === id)

    if (! fleet) {
      return
    }

    const units = 1000
    const payment = units / 2

    if (payment > account.balance) {
      return alert('Not enough balance.')
    }


    account.balance -= payment
    fleet.fuel += units
    update(Date.now())
  }, [])



  const successRate = useCallback((fleet: Fleet, planet: Planet): number => {
    const baseRate = rates[(parseInt(planet.id) - 1) * 5 + fleet.rank - 1]

    if (fleet.power > 1500) {
      const bonus = Math.floor((fleet.power - planet.required.power) / 100 * 2)
      const cap = bonusCap[parseInt(planet.id) - 1]
      return baseRate + bonus < cap ? baseRate + bonus : cap
    } else {
      return baseRate
    }
  }, [])



  const registerExpedition = useCallback((fleet: Fleet, planet: Planet) => {
    const toss = Math.random() * 100
    const chances = successRate(fleet, planet)

    const expedition = {
      id: generate(), fleet, planet,
      moment: Date.now(), chances, reward: planet.reward, toss
    } as Expedition


    if (toss <= chances) {
      fleet.fuel -= planet.required.fuel
      // FIXME: Don't forget the fleet contract
      account.balance += planet.reward
    } else {
      expedition.reward = 0
    }

    account.expeditions.push(expedition)
    update(Date.now())
  }, [])



  const context = { game, account,
    refresh: () => update(Date.now()),
    mintSpaceship, registerSpaceshipReveal, burnSpaceship, sellSpaceship,
    mintWorker, registerWorkerReveal, burnWorker, sellWorker,
    calculateRank,
    createFleet, updateFleet, payFleetContract, buyFleetfuel, registerExpedition,
    successRate
  }

  return (
    <GameContext.Provider value={context}>
      { children }
    </GameContext.Provider>
  )
}


interface Context {
  game: Game, account: Account

  mintSpaceship: () => void
  registerSpaceshipReveal: (id: string) => void
  burnSpaceship: (id: string) => void
  sellSpaceship: (id: string) => void

  mintWorker: () => void
  registerWorkerReveal: (id: string) => void
  burnWorker: (id: string) => void
  sellWorker: (id: string) => void

  calculateRank: (spaceships: Spaceship[]) => number

  createFleet: (spaceships: Spaceship[], workers: Worker[]) => void
  updateFleet: (id: string, spaceships: Spaceship[], workers: Worker[]) => void

  payFleetContract: (id: string) => void
  buyFleetfuel: (id: string) => void

  registerExpedition: (fleet: Fleet, planet: Planet) => void
  successRate: (fleet: Fleet, planet: Planet) => void
}

export function useGame(): Context {
  const context = useContext(GameContext)

  if (! context) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}
