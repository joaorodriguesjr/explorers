import '../styles/globals.css'
import type { AppProps } from 'next/app'
import MainMenu from '@Component/MainMenu'
import { GameProvider } from '@Context/Game'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <>
      <Head>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="theme-color" content="#252525"/>
        <link rel="manifest" href="/manifest.json"></link>
        <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
        <title>Space Explorer</title>
      </Head>
      <GameProvider>
        <MainMenu></MainMenu>
        <Component {...pageProps} />
      </GameProvider>
    </>
  )
}

export default MyApp
