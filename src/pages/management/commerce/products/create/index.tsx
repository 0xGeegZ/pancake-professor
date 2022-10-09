import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import { Box, Drawer, Grid, Hidden, IconButton,useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import AdditionalInfo from 'src/client/components/Management/Commerce/Create/AdditionalInfo'
import GeneralSection from 'src/client/components/Management/Commerce/Create/GeneralSection'
import PageHeader from 'src/client/components/Management/Commerce/Create/PageHeader'
import Sidebar from 'src/client/components/Management/Commerce/Create/Sidebar'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

const DrawerWrapper = styled(Drawer)(
  ({ theme }) => `
    width: 400px;
    flex-shrink: 0;
    z-index: 3;

    & > .MuiPaper-root {
        width: 400px;
        height: calc(100% - ${theme.header.height});
        position: absolute;
        top: ${theme.header.height};
        right: 0;
        z-index: 3;
        background: ${theme.colors.alpha.white[10]};
    }
`
)

const DrawerWrapperMobile = styled(Drawer)(
  ({ theme }) => `
    width: 360px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 360px;
        z-index: 3;
        background: ${theme.colors.alpha.white[30]};
  }
`
)

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
)

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
`
)

function ManagementProductCreate() {
  const theme = useTheme()

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const sidebarContent = (
    <Scrollbars universal autoHide>
      <Sidebar />
    </Scrollbars>
  )

  return (
    <>
      <Head>
        <title>Create Product - Commerce Management</title>
      </Head>
      <Box mb={3} display="flex">
        <MainContentWrapper>
          <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12}>
              <Box mt={3} display="flex" alignItems="center" justifyContent="space-between">
                <PageHeader />
                <Hidden lgUp>
                  <IconButtonToggle sx={{ ml: 2 }} color="primary" onClick={handleDrawerToggle} size="small">
                    <MenuTwoToneIcon />
                  </IconButtonToggle>
                </Hidden>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <GeneralSection />
            </Grid>
            <Grid item xs={12}>
              <AdditionalInfo />
            </Grid>
          </Grid>
        </MainContentWrapper>
        <Hidden lgUp>
          <DrawerWrapperMobile
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'left' : 'right'}
            open={mobileOpen}
            onClose={handleDrawerToggle}>
            {sidebarContent}
          </DrawerWrapperMobile>
        </Hidden>
        <Hidden lgDown>
          <DrawerWrapper variant="permanent" anchor={theme.direction === 'rtl' ? 'left' : 'right'} open>
            {sidebarContent}
          </DrawerWrapper>
        </Hidden>
      </Box>
    </>
  )
}

export default ManagementProductCreate

ManagementProductCreate.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
