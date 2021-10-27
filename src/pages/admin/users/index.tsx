import UsersList from '@/client/components/Management/Users/UsersList';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Footer from 'src/client/components/Footer';
import PageHeader from 'src/client/components/Management/Users/PageHeader';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';
import { useGetUsersQuery } from 'src/client/graphql/getUsers.generated';
import useRefMounted from 'src/client/hooks/useRefMounted';
import MainLayout from 'src/client/layouts/MainLayout';

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'
function ManagementUsers() {
  const isMountedRef = useRefMounted()
  // const [users, setUsers] = useState<User[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [{ data, fetching, error }] = useGetUsersQuery()

  // const getUsers = useCallback(async () => {
  //   try {
  //     const response = await axios.get<{ users: User[] }>('/api/users')
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }, [isMountedRef])

  // useEffect(() => {
  //   getUsers()
  // }, [getUsers])

  useEffect(() => {
    if (isMountedRef.current && data) {
      if (data?.getUsers) setUsers(data.getUsers)
    }
  }, [data, isMountedRef])

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
          <UsersList users={users} fetching={fetching} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementUsers

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
