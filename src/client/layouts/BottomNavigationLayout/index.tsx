import { Box, Drawer, Hidden } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { FC, ReactNode, useContext } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Logo from 'src/client/components/LogoSign'
import { SidebarContext } from 'src/client/contexts/SidebarContext'
import SidebarTopSection from 'src/client/layouts/AccentHeaderLayout/Sidebar/SidebarTopSection'
import SidebarMenu from 'src/client/layouts/BoxedSidebarLayout/Sidebar/SidebarMenu'

import BottomBar from './BottomBar'
import ThemeSettings from './ThemeSettings'

interface BottomNavigationLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  () => `
      flex: 1 1 auto;
      display: flex;
      height: 100%;

      .footer-wrapper {
        overflow: hidden;
        height: 0;
        box-shadow: none;
        border: 0;
      }
`
)

const MainContent = styled(Box)(
  ({ theme }) => `
        padding-bottom: ${theme.header.height};
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
`
)

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        position: relative;
        z-index: 5;
        height: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          height: calc(100% - ${theme.header.height});
          margin-top: ${theme.header.height};
        }
`
)

const TopSection = styled(Box)(
  ({ theme }) => `
        margin: ${theme.spacing(2, 2)};
`
)

const BottomNavigationLayout: FC<BottomNavigationLayoutProps> = ({ children }) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const closeSidebar = () => toggleSidebar()

  return (
    <>
      <MainWrapper>
        <Scrollbars universal autoHide>
          <MainContent>
            {children}
            <Hidden lgUp>
              <Drawer anchor="left" open={sidebarToggle} onClose={closeSidebar} variant="temporary" elevation={9}>
                <SidebarWrapper>
                  <Scrollbars universal autoHide>
                    <TopSection>
                      <Box sx={{ width: 52, ml: 1, mt: 1, mb: 3 }}>
                        <Logo />
                      </Box>
                      <SidebarTopSection />
                    </TopSection>
                    <SidebarMenu />
                  </Scrollbars>
                </SidebarWrapper>
              </Drawer>
            </Hidden>
            <ThemeSettings />
          </MainContent>
        </Scrollbars>
        <BottomBar />
      </MainWrapper>
    </>
  )
}

BottomNavigationLayout.propTypes = {
  children: PropTypes.node,
}

export default BottomNavigationLayout
