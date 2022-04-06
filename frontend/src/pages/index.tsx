import Heading from '@Component/Heading'
import PageContainer from '@Component/PageContainer'
import type { NextPage } from 'next'
import styles from './index.module.css'

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Heading size={1}>Dashboard</Heading>
    </PageContainer>
  )
}

export default Home
