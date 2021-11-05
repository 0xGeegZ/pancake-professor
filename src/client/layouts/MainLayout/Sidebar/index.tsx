import { Box, Drawer, Hidden } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import Logo from 'src/client/components/Logo'
import { SidebarContext } from 'src/client/contexts/SidebarContext'

import SidebarMenu from './SidebarMenu'

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    width: ${theme.sidebar.width};
    color: ${theme.sidebar.textColor};
    background: ${theme.sidebar.background};
    box-shadow: ${theme.sidebar.boxShadow};
    height: 100%;
    
    @media (min-width: ${theme.breakpoints.values.lg}px) {
        position: fixed;
        height: calc(100% - ${theme.spacing(8)});
        margin: ${theme.spacing(3)};
        z-index: 10;
        border-radius: ${theme.general.borderRadius};
    }
`
)

const TopSection = styled(Box)(
  ({ theme }) => `
        display: flex;
        height: 80px;
        align-items: center;
        margin: 0 ${theme.spacing(2)};
        border-bottom: ${theme.sidebar.dividerBg} solid 1px;
`
)

function Sidebar({ fetching, allMenuItems }) {
  // function Sidebar({ fetching, error, allMenuItems }) {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const closeSidebar = () => toggleSidebar()

  return (
    <>
      <Hidden lgDown>
        <SidebarWrapper>
          <TopSection>
            <Logo />
          </TopSection>
          <Box sx={{ height: 'calc(100% - 80px)' }}>
            <Scrollbars universal autoHide>
              <Box pt={1}>
                {/* <SidebarMenu fetching={fetching} error={error} allMenuItems={allMenuItems} /> */}
                <SidebarMenu fetching={fetching} allMenuItems={allMenuItems} />
              </Box>
            </Scrollbars>
          </Box>
        </SidebarWrapper>
      </Hidden>
      <Hidden lgUp>
        <Drawer anchor="left" open={sidebarToggle} onClose={closeSidebar} variant="temporary" elevation={9}>
          <SidebarWrapper>
            <Scrollbars universal autoHide>
              <TopSection>
                <Logo />
              </TopSection>
              {/* <SidebarMenu fetching={fetching} error={error} allMenuItems={allMenuItems} /> */}
              <SidebarMenu fetching={fetching} allMenuItems={allMenuItems} />
            </Scrollbars>
          </SidebarWrapper>
        </Drawer>
      </Hidden>
    </>
  )
}

export default Sidebar
