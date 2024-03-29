import { Box, Grid, Tab, Tabs } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import ActivityTab from 'src/client/components/Management/Users/Single/ActivityTab'
import Addresses from 'src/client/components/Management/Users/Single/Addresses'
import EditProfileTab from 'src/client/components/Management/Users/Single/EditProfileTab'
import Feed from 'src/client/components/Management/Users/Single/Feed'
import MyCards from 'src/client/components/Management/Users/Single/MyCards'
import NotificationsTab from 'src/client/components/Management/Users/Single/NotificationsTab'
import PopularTags from 'src/client/components/Management/Users/Single/PopularTags'
import ProfileCover from 'src/client/components/Management/Users/Single/ProfileCover'
import RecentActivity from 'src/client/components/Management/Users/Single/RecentActivity'
import SecurityTab from 'src/client/components/Management/Users/Single/SecurityTab'
import useRefMounted from 'src/client/hooks/useRefMounted'
import BoxedSidebarLayout from 'src/client/layouts/BoxedSidebarLayout'
import axios from 'src/client/utils/axios'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
)

function UserView() {
  const isMountedRef = useRefMounted()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { userId } = router.query
  const { t }: { t: any } = useTranslation()

  const [currentTab, setCurrentTab] = useState<string>('activity')

  const tabs = [
    { value: 'activity', label: t('Activity') },
    { value: 'edit_profile', label: t('Edit Profile') },
    { value: 'notifications', label: t('Notifications') },
    { value: 'security', label: t('Passwords/Security') },
  ]

  const handleTabsChange = (_event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value)
  }

  const getUser = useCallback(async () => {
    try {
      const response = await axios.get<{ user: User }>('/api/user', {
        params: {
          userId,
        },
      })
      if (isMountedRef.current) {
        setUser(response.data.user)
      }
    } catch (err) {
      console.error(err)
    }
  }, [userId, isMountedRef])

  useEffect(() => {
    getUser()
  }, [getUser])

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>{user.name} - Profile Details</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid>
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary">
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'activity' && <ActivityTab />}
            {currentTab === 'edit_profile' && <EditProfileTab />}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default UserView

UserView.getLayout = function getLayout(page: ReactElement) {
  return <BoxedSidebarLayout>{page}</BoxedSidebarLayout>
}
