import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { FC, ReactNode } from 'react'
import ThemeSettings from 'src/client/components/ThemeSettings'

import Header from './Header'
import Sidebar from './Sidebar'

interface AccentHeaderLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  () => `
        flex: 1 1 auto;
        display: flex;
        height: 100%;
`
)

const MainContent = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.header.height};
        margin-left: ${theme.sidebar.width};
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
`
)

const AccentHeaderLayout: FC<AccentHeaderLayoutProps> = ({ children }) => (
  <>
    <MainWrapper>
      <Header />
      <Sidebar />
      <MainContent>
        {children}
        <ThemeSettings />
      </MainContent>
    </MainWrapper>
  </>
)

AccentHeaderLayout.propTypes = {
  children: PropTypes.node,
}

export default AccentHeaderLayout
