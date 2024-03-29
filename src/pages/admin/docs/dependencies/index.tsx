import { Container, Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import Head from 'next/head'
import PageHeader from 'src/client/components/PageHeaderDocs'
import DocsLayout from 'src/client/layouts/DocsLayout'

import type { ReactElement } from 'react'

function Dependencies() {
  return (
    <>
      <Head>
        <title>Dependencies - Pancake Professor</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PageHeader heading="Dependencies" subheading="" />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              At it's core, Pancake Professor is powered by <code>React</code>, <code>Typescript</code>,{' '}
              <code>@emotion/react</code>, <code>Material-UI</code> and <code>NextJS</code>.
            </Typography>
            <Typography paragraph>
              All dependencies are defined under the root folder, in <code>package.json</code> file. We periodically
              check and update these dependencies with their latest versions to ensure maximum compatibility and
              security.
            </Typography>
            <br />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Core Dependencies
            </Typography>
            <Typography paragraph>
              These dependencies should not be removed from the progress regardless of which page you keep or remove
              from the downloaded template files. They represent the core of the whole project and removing any of them
              will cause an error somewhere in the template.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="@mui/material" secondary="5.0.3" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="@mui/icons-material" secondary="5.0.3" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="@mui/lab" secondary="5.0.0-alpha.50" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="react" secondary="17.0.2" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="react-dom" secondary="17.0.2" />
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemText primary="next" secondary="11.1.2" />
              </ListItem>
            </List>
            <br />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Unused Dependencies
            </Typography>
            <Typography paragraph>
              Some dependencies are only used for certain pages or sections. Based on the pages/sections you'll be using
              from the Tokyo React Admin Dashboard template, you can remove the unused dependencies in order to keep
              things as fast and clean as possible.
            </Typography>
            <Typography paragraph>
              For example, if you are not going to use the "Projects Board" application, you can remove the{' '}
              <code>react-beautiful-dnd</code> dependency as that is only used for that specific section.
            </Typography>
            <br />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Dependencies

Dependencies.getLayout = function getLayout(page: ReactElement) {
  return <DocsLayout>{page}</DocsLayout>
}
