import { useState, useCallback, ChangeEvent, useEffect } from 'react';
import type { ReactElement } from 'react';
import MainLayout from "src/client/layouts/MainLayout";

import Head from 'next/head';
import Footer from 'src/client/components/Footer';

import { Box, Tabs, Tab, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import useRefMounted from 'src/client/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import type { User } from 'src/client/models/user';
import ProfileCover from 'src/client/components/Management/Users/Single/ProfileCover';
import RecentActivity from 'src/client/components/Management/Users/Single/RecentActivity';
import AccountSecurity from 'src/client/components/Dashboards/Crypto/AccountSecurity';

import Feed from 'src/client/components/Management/Users/Single/Feed';
import PopularTags from 'src/client/components/Management/Users/Single/PopularTags';
import MyCards from 'src/client/components/Management/Users/Single/MyCards';
import Addresses from 'src/client/components/Management/Users/Single/Addresses';
import ActivityTab from 'src/client/components/Management/Users/Single/ActivityTab';
import EditProfileTab from 'src/client/components/Management/Users/Single/EditProfileTab';
import NotificationsTab from 'src/client/components/Management/Users/Single/NotificationsTab';
import SecurityTab from 'src/client/components/Management/Users/Single/SecurityTab';
import { styled } from '@mui/material/styles';
import axios from 'src/client/utils/axios';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function UserView() {
  const isMountedRef = useRefMounted();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { userId } = router.query;
  const { t }: { t: any } = useTranslation();

  const [currentTab, setCurrentTab] = useState<string>('edit_profile');

  const tabs = [
    { value: 'edit_profile', label: t('Edit Profile') },
    // { value: 'notifications', label: t('Notifications') },
    // { value: 'security', label: t('Passwords/Security') }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get<{ user: User }>('/api/user', {
        params: {
          userId
        }
      });
      if (isMountedRef.current) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId, isMountedRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // if (!user) {
  //   return null;
  // }

  return (
    <>
      <Head>
        <title>Profile Details</title>
        {/* <title>{user.name} - Profile Details</title> */}
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid
          sx={{ px: 4 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {/* <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid> */}
          <Grid item xs={12}>
            {/* {currentTab === 'activity' && <ActivityTab />} */}
            {currentTab === 'edit_profile' && <EditProfileTab />}
            {/* {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />} */}
          </Grid>
          {/* <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid> */}
           <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          {/* <Grid item xs={12} md={8}>
            <Feed />
          </Grid> */}
          {/* <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid> */}
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          {/* <Grid item xs={12} md={5}>
            <Addresses />
          </Grid> */}
          
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default UserView;

UserView.getLayout = function getLayout(page: ReactElement) {
  return (
      <MainLayout>
          {page}
      </MainLayout>
  )
}