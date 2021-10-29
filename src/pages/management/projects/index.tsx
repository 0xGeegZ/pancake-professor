import { useState, useEffect, useCallback } from 'react'
import axios from 'src/client/utils/axios'
import type { ReactElement } from 'react'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'

import Head from 'next/head'
import PageHeader from 'src/client/components/Management/Projects/PageHeader'
import Footer from 'src/client/components/Footer'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'

import { Grid } from '@mui/material'
import useRefMounted from 'src/client/hooks/useRefMounted'
import type { Project } from 'src/client/models/project'

import Results from 'src/client/components/Management/Projects/Results'

function ManagementProjects() {
  const isMountedRef = useRefMounted()
  const [projects, setProjects] = useState<Project[]>([])

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get<{ projects: Project[] }>('/api/projects')

      if (isMountedRef.current) {
        setProjects(response.data.projects)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef])

  useEffect(() => {
    getProjects()
  }, [getProjects])

  return (
    <>
      <Head>
        <title>Projects - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Results projects={projects} />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}

export default ManagementProjects

ManagementProjects.getLayout = function getLayout(page: ReactElement) {
  return <AccentHeaderLayout>{page}</AccentHeaderLayout>
}
