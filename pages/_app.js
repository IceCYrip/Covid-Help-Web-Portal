import React from 'react'
import '../styles/globals.css'
import store, { persistor } from '../redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react'
import router from 'next/router'
import styles from '../styles/pages.module.css'

function MyApp({ Component, pageProps }) {
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setLoadingProgress(40)
    })

    router.events.on('routeChangeComplete', () => {
      setLoadingProgress(100)
    })
  }, [])

  return (
    <>
      <LoadingBar
        color="black"
        waitingTime={250}
        progress={loadingProgress}
        onLoaderFinished={() => {
          setLoadingProgress(0)
        }}
      />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
      <div className={styles.appUnavailable}>
        <h2 style={{ fontWeight: 'bold' }}>UNAVAILABLE!</h2>
        <span>This website is unavailable on mobile as of now.</span>
        <span>Please open this website on laptop. </span>
        <span> Inconvenience caused is deeply regretted </span>
      </div>
    </>
  )
}

export default MyApp
