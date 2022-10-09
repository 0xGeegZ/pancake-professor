import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { FC, ReactNode } from 'react'
import ThemeSettings from 'src/client/components/ThemeSettings'

import Header from './Header'
import Sidebar from './Sidebar'

interface CollapsedSidebarLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  ({ theme }) => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
        
        @media (min-width: ${theme.breakpoints.values.md}px) {
            padding-left: 120px;
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

const CollapsedSidebarLayout: FC<CollapsedSidebarLayoutProps> = ({ children }) => (
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

CollapsedSidebarLayout.propTypes = {
  children: PropTypes.node,
}

export default CollapsedSidebarLayout
