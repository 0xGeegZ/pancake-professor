import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import Results from 'src/client/components/Management/Users/UsersList'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import useRefMounted from 'src/client/hooks/useRefMounted'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'
import type { User } from 'src/client/models/user'
import axios from 'src/client/utils/axios'

function ManagementUsers() {
  const isMountedRef = useRefMounted()
  const [users, setUsers] = useState<User[]>([])
  const [fetching, setFetching] = useState<boolean>(true)

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get<{ users: User[] }>('/api/users')

      if (isMountedRef.current) {
        setUsers(response.data.users)
        setFetching(false)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Results users={users} fetching={fetching} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementUsers

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
