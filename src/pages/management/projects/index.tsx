import { Grid } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useCallback,useEffect, useState } from 'react'
import Footer from 'src/client/components/Footer'
import PageHeader from 'src/client/components/Management/Projects/PageHeader'
import Results from 'src/client/components/Management/Projects/Results'
import PageTitleWrapper from 'src/client/components/PageTitleWrapper'
import useRefMounted from 'src/client/hooks/useRefMounted'
import AccentHeaderLayout from 'src/client/layouts/AccentHeaderLayout'
import type { Project } from 'src/client/models/project'
import axios from 'src/client/utils/axios'

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
