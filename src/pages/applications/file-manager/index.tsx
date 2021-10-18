import { useState } from 'react';
import type { ReactElement } from 'react';

import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import Head from 'next/head';
import PageHeader from 'src/client/components/Applications/FileManager/PageHeader';
import {
  Box,
  Drawer,
  Grid,
  Hidden,
  IconButton
} from '@mui/material';
import { Scrollbars } from 'react-custom-scrollbars-2';

import FileManagerSidebar from 'src/client/components/Applications/FileManager/FileManagerSidebar';
import QuickAccess from 'src/client/components/Applications/FileManager/QuickAccess';
import TeamFolders from 'src/client/components/Applications/FileManager/TeamFolders';
import AllFolders from 'src/client/components/Applications/FileManager/AllFolders';

import { styled, useTheme } from '@mui/material/styles';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

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
        background: ${theme.colors.gradients.blue3};
        color: ${theme.colors.alpha.white[100]};
    }
`
);

const DrawerWrapperMobile = styled(Drawer)(
  ({ theme }) => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
        background: ${theme.colors.gradients.blue3};
        color: ${theme.colors.alpha.white[100]};
  }
`
);

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
`
);

function ApplicationsFileManager() {
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Scrollbars universal autoHide>
      <FileManagerSidebar />
    </Scrollbars>
  );

  return (
    <>
      <Head>
        <title>File Manager - Applications</title>
      </Head>
      <Box sx={{ width: { xs: '100%', lg: 'calc(100% - 400px)' } }}>
        <MainContentWrapper>
          <Grid
            sx={{ px: 4 }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box mt={3}>
                  <PageHeader />
                </Box>
                <Hidden lgUp>
                  <IconButtonToggle
                    color="primary"
                    onClick={handleDrawerToggle}
                    size="small"
                  >
                    <MenuTwoToneIcon />
                  </IconButtonToggle>
                </Hidden>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <QuickAccess />
            </Grid>
            <Grid item xs={12}>
              <TeamFolders />
            </Grid>
            <Grid item xs={12}>
              <AllFolders />
            </Grid>
          </Grid>
        </MainContentWrapper>
        <Hidden lgUp>
          <DrawerWrapperMobile
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'left' : 'right'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
          >
            {sidebarContent}
          </DrawerWrapperMobile>
        </Hidden>
        <Hidden lgDown>
          <DrawerWrapper
            variant="permanent"
            anchor={theme.direction === 'rtl' ? 'left' : 'right'}
            open
          >
            {sidebarContent}
          </DrawerWrapper>
        </Hidden>
      </Box>
    </>
  );
}

export default ApplicationsFileManager;

ApplicationsFileManager.getLayout = function getLayout(page: ReactElement) {
  return (
      <AccentHeaderLayout>
          {page}
      </AccentHeaderLayout>
  )
}