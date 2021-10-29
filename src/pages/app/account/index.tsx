import 'moment-timezone'

import { Box, CircularProgress, Grid, Tabs } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import EditProfileTab from 'src/client/components/Management/Users/Single/EditProfileTab'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'

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
  const [user, setUser] = useState<User | any>(null)
  const router = useRouter()
  const { userId } = router.query
  const { enqueueSnackbar } = useSnackbar()

  const [{ data, fetching, error }] = useGetCurrentUserQuery()

  useEffect(() => {
    if (!data) return
    if (!data.currentUser) {
      router.push('/app')
      return
    }

    if (isMountedRef.current) {
      setUser(data.currentUser)
    }
  }, [data])

  const { t }: { t: any } = useTranslation()

  const [currentTab, setCurrentTab] = useState<string>('edit_profile')

  const tabs = [
    { value: 'edit_profile', label: t('Edit Profile') },
    // { value: 'notifications', label: t('Notifications') },
    // { value: 'security', label: t('Passwords/Security') }
  ]

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value)
  }

  // const getUser = useCallback(async () => {
  //   try {
  //     const response = await axios.get<{ user: User }>('/api/user', {
  //       params: {
  //         userId,
  //       },
  //     })
  //     if (isMountedRef.current) {
  //       setUser(response.data.user)
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }, [userId, isMountedRef])

  // useEffect(() => {
  //   getUser()
  // }, [getUser])

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
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
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
            {currentTab === 'edit_profile' &&
              (fetching || !user ? (
                <Grid
                  sx={{ py: 10 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={3}>
                  <Grid item>
                    <CircularProgress color="secondary" size="1rem" />
                  </Grid>
                </Grid>
              ) : (
                <EditProfileTab user={user} isAdmin={false} />
              ))}
            {/* {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />} */}
          </Grid>
          {/* <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid> */}
          {/* <Grid item xs={12} md={12}>
            <MyCards />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid> */}
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default UserView

UserView.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
