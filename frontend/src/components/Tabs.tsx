import { FunctionComponent, Children, useState } from 'react'
import styles from './Tabs.module.css'

const Tabs: FunctionComponent<{ labels: string[], activeTab? :number }> = ({ labels, activeTab = 0,children }) => {
  const [ active, updateActive ] = useState(activeTab)

  const tabs = labels.map((label, index) => (
    <li className={active === index ? styles.active : '' } key={index} onClick={() => updateActive(index)} >
      {label}
    </li>
  ))

  const contents = Children.map(children, (child, index) => (
    <div key={index}>{child}</div>
  ))

  const style = {left: `${-active * 100}%`}

  return (
    <div className={styles.container}>
      <ol>
        {tabs}
      </ol>
      <div className={styles.contents} style={style}>
        {contents}
      </div>
    </div>
  )
}

export default Tabs
