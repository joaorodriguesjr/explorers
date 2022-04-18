import { FunctionComponent, useState } from 'react'
import styles from './MainMenu.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MainMenu: FunctionComponent = () => {
  const router = useRouter()
  const [ hide, updateHide ] = useState(true)
  const container = hide ? `${styles.container} ${styles.hide}` : styles.container

  function executeReset() {
    setTimeout(() => {
      localStorage.removeItem('game')
    }, 250)

    setTimeout(() => {
      updateHide(true)
    }, 500)

    setTimeout(() => {
      router.reload()
    }, 750)
  }

  return (
    <>
      <div className={styles.hamburger}><button onClick={() => updateHide(! hide)}>☰</button></div>
      <nav className={container}>
        <img src={'/logo.png'} width={192} height={192}/>
        <div className={styles.item} onClick={() => updateHide(true)}><Link href={'/management/spaceships'}>Spaceships</Link></div>
        <div className={styles.item} onClick={() => updateHide(true)}><Link href={'/management/workers'}>Workers</Link></div>
        <div className={styles.item} onClick={() => updateHide(true)}><Link href={'/management/fleets'}>Fleets</Link></div>
        <div className={styles.item} onClick={() => updateHide(true)}><Link href={'/management/expeditions'}>Expeditions</Link></div>
        <button className={styles.reset} onClick={() => executeReset()}>Reset Game Data</button>
      </nav>
    </>
  )
}

export default MainMenu
