import { Box, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import Footer from 'src/client/components/Footer'
import AdminUsersList from 'src/client/components/Management/Users/AdminUsersList'
import PageHeader from 'src/client/components/Management/Users/PageHeader'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import { useGetUsersQuery } from 'src/client/graphql/getUsers.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'

const MainContentWrapper = styled(Box)(
  ({ theme }) => `
    min-height: calc(100% - ${theme.spacing(20)});
`
)

function ManagementUsers() {
  const isMountedRef = useRefMounted()
  const [users, setUsers] = useState<any[]>([])
  const [{ data, fetching }] = useGetUsersQuery()

  useEffect(() => {
    if (isMountedRef.current && data && data?.getUsers) setUsers(data.getUsers)
  }, [data, isMountedRef])

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <MainContentWrapper>
        <PageTitleWrapper>
          <PageHeader />
        </PageTitleWrapper>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <AdminUsersList users={users} fetching={fetching} />
          </Grid>
        </Grid>
      </MainContentWrapper>

      <Footer />
    </>
  )
}

export default ManagementUsers

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
