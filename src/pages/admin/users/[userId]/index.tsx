import { Box, Grid, Zoom } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import EditProfileTab from 'src/client/components/Management/Users/Single/EditProfileTab'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'
import menuItems from 'src/client/layouts/MainLayout/Sidebar/SidebarMenu/items'
import { useGlobalStore } from 'src/client/store/swr'

// import { useGetUsersQuery } from 'src/client/graphql/getUsers.generated'

import type { ReactElement } from 'react'

function UserView() {
  const { t }: { t: any } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const isMountedRef = useRefMounted()

  const [allMenuItems, setAllMenuItems] = useState<any>(null)

  // user special query
  // const [{ data, fetching }] = useGetUsersQuery()
  const { user, fetching } = useGlobalStore()

  useEffect(() => {
    if (!user.isAdmin) {
      enqueueSnackbar(t(`Only for admin.`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      router.push('/')

      return
    }

    if (!user && !fetching) {
      enqueueSnackbar(t(`You need to be connected to have data fecthing for this view.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }

    if (!user) return

    if (allMenuItems) return

    if (isMountedRef.current) {
      const filtereds = user.isAdmin ? menuItems : menuItems.filter((mi) => mi.heading !== 'Admin')
      setAllMenuItems(filtereds)
    }
  }, [user, fetching, router, isMountedRef, allMenuItems, enqueueSnackbar, t])

  return (
    <>
      <Head>
        <title>Profil Details</title>
        {/* <title>{user?.address} - Profil Details</title> */}
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <EditProfileTab user={user} />
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
