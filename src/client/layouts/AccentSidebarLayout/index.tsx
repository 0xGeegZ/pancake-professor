import { FC, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'

import ThemeSettings from 'src/client/components/ThemeSettings'

import Sidebar from './Sidebar'
import Header from './Header'

interface AccentSidebarLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding-left: ${theme.sidebar.width};
        }
`
)

const MainContent = styled(Box)(
  ({ theme }) => `
    margin-top: ${theme.header.height};
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
`
)

const AccentSidebarLayout: FC<AccentSidebarLayoutProps> = ({ children }) => (
  <>
    <Sidebar />
    <MainWrapper>
      <Header />
      <MainContent>
        {children}
        <ThemeSettings />
      </MainContent>
    </MainWrapper>
  </>
)

AccentSidebarLayout.propTypes = {
  children: PropTypes.node,
}

export default AccentSidebarLayout
