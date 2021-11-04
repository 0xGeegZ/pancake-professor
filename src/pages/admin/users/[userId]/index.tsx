import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import Footer from 'src/client/components/Footer'
import MainLayout from 'src/client/layouts/MainLayout'

import type { ReactElement } from 'react'
// import type { User } from 'src/client/models/user'

// const TabsWrapper = styled(Tabs)(
//   () => `
//     .MuiTabs-scrollableX {
//       overflow-x: auto !important;
//     }
// `
// )

function UserView() {
  // const isMountedRef = useRefMounted()
  // const [user, setUser] = useState<User | null>(null)
  // const router = useRouter()
  // const { userId } = router.query
  // const { t }: { t: any } = useTranslation()

  // const [currentTab, setCurrentTab] = useState<string>('edit_profile')

  // const tabs = [
  //   { value: 'edit_profile', label: t('Edit Profile') },
  //   // { value: 'notifications', label: t('Notifications') },
  //   // { value: 'security', label: t('Passwords/Security') }
  // ]

  // const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
  //   setCurrentTab(value)
  // }

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
          <Grid item xs={12}>
            {/* Need to be reactivated */}
            {/* <EditProfileTab isAdmin /> */}
          </Grid>
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
