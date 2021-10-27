import { Container, Grid, List, ListItem, Typography } from '@mui/material';
import Head from 'next/head';
import PageHeader from 'src/client/components/PageHeaderDocs';
import DocsLayout from 'src/client/layouts/DocsLayout';

import type { ReactElement } from 'react'
function Changelog() {
  return (
    <>
      <Head>
        <title>Changelog - Pancake Professor</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PageHeader heading="Changelog" subheading=""></PageHeader>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Version 1.0.0
            </Typography>
            <Typography component="span" fontWeight="normal" variant="h3" color="text.secondary">
              Released on: <b>16 October 2021</b>
            </Typography>
            <br />
            <br />
            <List>
              <ListItem>initial version, first release</ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Changelog

Changelog.getLayout = function getLayout(page: ReactElement) {
  return <DocsLayout>{page}</DocsLayout>
}
