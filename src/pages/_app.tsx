// import App from "next/app";
import React, { ReactElement, useEffect, useRef } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import UrqlProvider from '@context/UrqlProvider'
import ConsentProvider from '@context/CookieConsent'
import App from '../../src/components/App'
import { OrbisProvider } from '@context/DirectMessages'
import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { connectKitTheme, wagmiClient } from '@utils/wallet'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useRouter } from 'next/router'
import { getBackgroundColor } from '@utils/theme'

import { createGlobalStyle } from 'styled-components'
// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
    persistence: 'memory'
  })
}

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })
  const router = useRouter()
  const [theme, setTheme] = React.useState({})
  useEffect(() => {
    // Track page views

    async function init() {
      const backgroundColor: any = await getBackgroundColor()
      const items = [
        '--font-color-text',
        '--font-color-heading',
        '--background-body',
        '--background-body-transparent',
        '--background-content'
      ]
      let theme = ''
      items.forEach((item) => {
        theme += `${item}:red;`
      })
      console.log(theme)
      setTheme(theme)
    }
    init()
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  console.log(theme)
  return (
    <>
      <style>{`
      :root {
        ${theme}
      }
      `}</style>

      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
          <MarketMetadataProvider>
            <UrqlProvider>
              <UserPreferencesProvider>
                <PricesProvider>
                  <ConsentProvider>
                    <OrbisProvider>
                      <PostHogProvider client={posthog}>
                        <App>
                          <Component {...pageProps} />
                        </App>
                      </PostHogProvider>
                    </OrbisProvider>
                  </ConsentProvider>
                </PricesProvider>
              </UserPreferencesProvider>
            </UrqlProvider>
          </MarketMetadataProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
