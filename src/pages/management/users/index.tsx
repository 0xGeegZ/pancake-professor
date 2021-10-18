import { useState, useEffect, useCallback } from 'react';
import axios from 'src/client/utils/axios';
import type { ReactElement } from 'react';
import AccentHeaderLayout from "src/client/layouts/AccentHeaderLayout";

import Head from 'next/head';
import PageHeader from 'src/client/components/Management/Users/PageHeader';
import Footer from 'src/client/components/Footer';

import { Grid } from '@mui/material';
import useRefMounted from 'src/client/hooks/useRefMounted';
import type { User } from 'src/client/models/user';
import PageTitleWrapper from 'src/client/components/PageTitleWrapper';

import Results from 'src/client/components/Management/Users/Results';

function ManagementUsers() {
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get<{ users: User[] }>('/api/users');

      if (isMountedRef.current) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results users={users} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementUsers;

ManagementUsers.getLayout = function getLayout(page: ReactElement) {
  return (
      <AccentHeaderLayout>
          {page}
      </AccentHeaderLayout>
  )
}