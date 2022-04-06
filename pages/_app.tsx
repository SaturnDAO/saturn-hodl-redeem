import 'blockchain-prototypes'
import 'window-ethereum'
import React from 'react'
import Head from 'next/head'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../lib/theme'
import EthersContext from '../context'
import NavigationBar from '../components/NavigationBar'

import type { AppProps } from 'next/app'

const Application: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
        <ThemeProvider theme={theme}>
          <EthersContext disableChainReload>
            <CssBaseline />
            <NavigationBar />
              <div style={{ marginTop: '4em' }} >
              <Component {...pageProps} />
              </div>
            
          </EthersContext>
        </ThemeProvider>
    </React.Fragment>
  )
}

export default Application