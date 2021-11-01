/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeProvider } from '@mui/material'
import { StylesProvider } from '@mui/styles'
import { createContext, FC, useEffect, useState } from 'react'

import { themeCreator } from './base'

export const ThemeContext = createContext((_themeName: string): void => {})

const ThemeProviderWrapper: FC = (props) => {
  const [themeName, _setThemeName] = useState('PureLightTheme')

  useEffect(() => {
    const curThemeName = window.localStorage.getItem('appTheme') || 'PureLightTheme'
    _setThemeName(curThemeName)
  }, [])

  const theme = themeCreator(themeName)
  const setThemeName = (pthemeName: string): void => {
    window.localStorage.setItem('appTheme', pthemeName)
    _setThemeName(pthemeName)
  }

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  )
}

export default ThemeProviderWrapper
