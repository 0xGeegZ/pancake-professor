import 'nprogress/nprogress.css';
import 'src/client/mocks';
import 'src/client/utils/chart';

import { CacheProvider, EmotionCache } from '@emotion/react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { appWithTranslation } from 'next-i18next';
import { PageTransition } from 'next-page-transitions';
import Head from 'next/head';
import Router from 'next/router';
import { SnackbarProvider } from 'notistack';
import nProgress from 'nprogress';
import { ChangeEvent, useRef, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SidebarProvider } from 'src/client/contexts/SidebarContext';
import createEmotionCache from 'src/client/createEmotionCache';
import useScrollTop from 'src/client/hooks/useScrollTop';
import store from 'src/client/store';
import ThemeProvider from 'src/client/theme/ThemeProvider';
import { Provider as GraphQLProvider } from 'urql';

import { client } from '../client/graphql/client';

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
const clientSideEmotionCache = createEmotionCache()

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  Component: NextPageWithLayout
}

function MyApp(props: MyAppProps) {
  const notistackRef = useRef<any>(null)

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const getLayout = Component.getLayout ?? ((page) => page)
  useScrollTop()
  const TIMEOUT = 400

  Router.events.on('routeChangeStart', nProgress.start)
  Router.events.on('routeChangeError', nProgress.done)
  Router.events.on('routeChangeComplete', nProgress.done)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Pancake Professor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <GraphQLProvider value={client}>
        <ReduxProvider store={store}>
          <SidebarProvider>
            <ThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SnackbarProvider
                  maxSnack={6}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  ref={notistackRef}
                  action={(key) => (
                    <Button
                      onClick={() => notistackRef.current.closeSnackbar(key)}
                      style={{ color: '#fff', fontSize: '20px' }}>
                      ✖
                    </Button>
                  )}>
                  <CssBaseline />
                  <PageTransition
                    timeout={TIMEOUT}
                    classNames="page-transition"
                    loadingTimeout={{
                      enter: TIMEOUT,
                      exit: 500,
                    }}
                    loadingClassNames="loading-indicator">
                    {getLayout(<Component {...pageProps} />)}
                  </PageTransition>
                </SnackbarProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </SidebarProvider>
        </ReduxProvider>
      </GraphQLProvider>
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, -10px, 0);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }
        .page-transition-exit {
          opacity: 1;
        }
        .page-transition-exit-active {
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }
        .loading-indicator-appear,
        .loading-indicator-enter {
          opacity: 0;
        }
        .loading-indicator-appear-active,
        .loading-indicator-enter-active {
          opacity: 1;
          transition: opacity ${TIMEOUT}ms;
        }
      `}</style>
    </CacheProvider>
  )
}

export default appWithTranslation(MyApp)
