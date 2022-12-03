import React from 'react'
import '../styles/globals.css'
import store, { persistor } from '../redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react'
import router from 'next/router'

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
        color='black'
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
    </>
  )
}

export default MyApp
