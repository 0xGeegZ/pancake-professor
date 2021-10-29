import { alpha, Box, Card, Container, Drawer, Hidden } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { FC, ReactNode, useContext } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Logo from 'src/client/components/LogoSign'
import ThemeSettings from 'src/client/components/ThemeSettings'
import { SidebarContext } from 'src/client/contexts/SidebarContext'
import SidebarMenu from 'src/client/layouts/AccentHeaderLayout/Sidebar/SidebarMenu'
import SidebarTopSection from 'src/client/layouts/AccentHeaderLayout/Sidebar/SidebarTopSection'

import TopBar from './TopBar'

interface TopNavigationLayoutProps {
  children?: ReactNode
}

const MainWrapper = styled(Box)(
  ({ theme }) => `
  padding-bottom: ${theme.spacing(4)};
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .footer-wrapper {
    box-shadow: 0px 0px 2px ${theme.colors.alpha.black[30]};
}
`
)

const MainContent = styled(Container)(
  ({ theme }) => `
        margin-top: -${theme.spacing(45)};
        position: relative;
        z-index: 55;
`
)

const CardWrapper = styled(Card)(
  ({ theme }) => `
        min-height: 100vh;
        backdrop-filter: blur(5px);
        border-radius: ${theme.general.borderRadiusXl};
        background: ${alpha(theme.colors.alpha.white[100], 0.9)};
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

const TopNavigationLayout: FC<TopNavigationLayoutProps> = ({ children }) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const closeSidebar = () => toggleSidebar()

  return (
    <>
      <MainWrapper>
        <TopBar />
        <MainContent maxWidth="lg">
          <CardWrapper>{children}</CardWrapper>
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
      </MainWrapper>
    </>
  )
}

TopNavigationLayout.propTypes = {
  children: PropTypes.node,
}

export default TopNavigationLayout
