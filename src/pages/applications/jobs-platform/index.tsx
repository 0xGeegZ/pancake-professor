import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import { useState, useEffect, useCallback } from 'react';
import type { ReactElement } from 'react';

import Head from 'next/head';
import PageHeader from 'src/client/components/Applications/JobsPlatform/PageHeader';
import Footer from 'src/client/components/Footer';
import Sidebar from 'src/client/components/Applications/JobsPlatform/Sidebar';

import {
  TextField,
  Divider,
  Card,
  Hidden,
  Box,
  Autocomplete,
  Grid,
  IconButton,
  Drawer
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import axios from 'src/client/utils/axios';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

import useRefMounted from 'src/client/hooks/useRefMounted';
import type { Job } from 'src/client/models/job';

import Results from 'src/client/components/Applications/JobsPlatform/Results';
import { Scrollbars } from 'react-custom-scrollbars-2';

const sidebarContent = (
  <Scrollbars universal autoHide>
    <Sidebar />
  </Scrollbars>
);

const SearchIconWrapper = styled(SearchTwoToneIcon)(
  ({ theme }) => `
        color: ${theme.colors.alpha.black[30]}
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(6)};
  height: ${theme.spacing(6)};
  position: absolute;
  background: ${theme.colors.alpha.white[100]};
  z-index: 5;
  top: calc(${theme.header.height} + ${theme.spacing(4)});
`
);

const jobsTags = [
  { title: 'QA Engineer' },
  { title: 'Team Lead' },
  { title: 'React Developer' },
  { title: 'Project Manager' }
];

const jobsLocations = [
  { title: 'Bucharest, Romania' },
  { title: 'San Francisco, USA' },
  { title: 'Madrid, Spain' },
  { title: 'Berlin, Germany' },
  { title: 'Paris, France' },
  { title: 'London, UK' }
];

function ApplicationsJobsPlatform() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isMountedRef = useRefMounted();
  const [jobs, setJobs] = useState<Job[]>([]);

  const getJobs = useCallback(async () => {
    try {
      const response = await axios.get<{ jobs: Job[] }>('/api/jobs');

      if (isMountedRef.current) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getJobs();
  }, [getJobs]);

  return (
    <>
      <Head>
        <title>Jobs Platform - Applications</title>
      </Head>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Box mt={3}>
            <PageHeader />
          </Box>
          <Hidden mdUp>
            <IconButtonToggle
              color="primary"
              onClick={handleDrawerToggle}
              size="small"
            >
              <MenuTwoToneIcon />
            </IconButtonToggle>
          </Hidden>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              pl: { xs: 1, lg: 3 },
              pr: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Hidden lgDown>
              <SearchIconWrapper />
            </Hidden>
            <Grid
              alignItems="center"
              justifyContent="space-around"
              container
              spacing={0}
            >
              <Hidden lgDown>
                <Divider orientation="vertical" sx={{ height: 48, mx: 2 }} />
              </Hidden>
              <Grid item xs={12} lg={6} md={6}>
                <Autocomplete
                  multiple
                  sx={{ m: 2 }}
                  limitTags={2}
                  options={jobsTags}
                  getOptionLabel={(option) => option.title}
                  defaultValue={[jobsTags[0], jobsTags[1]]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      label={t('Jobs Tags')}
                      placeholder={t('Select tags...')}
                    />
                  )}
                />
              </Grid>
              <Hidden lgDown>
                <Divider orientation="vertical" sx={{ height: 48, mx: 2 }} />
              </Hidden>
              <Grid item xs={12} lg={5} md={6}>
                <Autocomplete
                  sx={{ m: 2 }}
                  multiple
                  limitTags={2}
                  options={jobsLocations}
                  getOptionLabel={(option) => option.title}
                  defaultValue={[jobsLocations[1]]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      label={t('Location')}
                      placeholder={t('Select location...')}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={3}>
            <Sidebar />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={9}>
          {jobs && <Results jobs={jobs} />}
        </Grid>
      </Grid>
      <Hidden mdUp>
        <DrawerWrapperMobile
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {sidebarContent}
        </DrawerWrapperMobile>
      </Hidden>
      <Footer />
    </>
  );
}

export default ApplicationsJobsPlatform;

ApplicationsJobsPlatform.getLayout = function getLayout(page: ReactElement) {
  return (
      <AccentHeaderLayout>
          {page}
      </AccentHeaderLayout>
  )
}