import PlayersList from '@/client/components/Management/Users/PlayersList';
import { Grid } from '@mui/material';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Footer from 'src/client/components/Footer';
import PageHeader from 'src/client/components/Management/Users/PageHeader';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';
import useRefMounted from 'src/client/hooks/useRefMounted';
import MainLayout from 'src/client/layouts/MainLayout';
import loadPlayers from 'src/client/thegraph/loadPlayers';

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'
function ManagementUsers() {
  const isMountedRef = useRefMounted()
  // const [users, setUsers] = useState<User[]>([])
  const [fetching, setFetching] = useState<boolean>(true)
  const [players, setPlayers] = useState<any[]>([])
  // const [{ data, fetching, error }] = useGetUsersQuery()
  // const [{ data, fetching, error }] = useGetPlayersQuery()

  const getPlayers = useCallback(async () => {
    if (isMountedRef.current) {
      try {
        const players = await loadPlayers({ currentEpoch: '15931' })
        setPlayers(players)
      } catch (err) {
        console.error(err)
      }
      setFetching(false)
    }
  }, [isMountedRef])

  useEffect(() => {
    getPlayers()
  }, [getPlayers])

  // useEffect(() => {
  //   if (isMountedRef.current && data) {
  //     //   console.log('🚀 ~ file: index.tsx ~ line 36 ~ useEffect ~ data?.getUsers', data?.getUsers)
  //     //   if (data?.getUsers) setUsers(data.getUsers)

  //     console.log('🚀 ~ file: index.tsx ~ line 36 ~ useEffect ~ data?.getPlayers', data?.getPlayers)
  //     if (data?.getPlayers) setPlayers(data.getPlayers)
  //   }
  //   // }
  // }, [data, isMountedRef])

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
          <PlayersList players={players} fetching={fetching} />
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
