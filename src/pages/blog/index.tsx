import { Box, Button, Container, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import Link from 'src/client/components/Link'
import Logo from 'src/client/components/LogoSign'
import BlogCard from 'src/client/components/Management/Users/Single/BlogCard'
import BaseLayout from 'src/client/layouts/BaseLayout'
import LanguageSwitcher from 'src/client/layouts/BoxedSidebarLayout/Header/Buttons/LanguageSwitcher'

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(14)};
`
)

const BlogWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
)

const Blog = () => {
  const { t }: { t: any } = useTranslation()

  return (
    <BlogWrapper>
      <Head>
        <title>Pancake Professor Blog</title>
      </Head>

      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
              <Box />
              <Box>
                <LanguageSwitcher />
                <Link underline="hover" href="/" rel="noopener noreferrer" sx={{ ml: 2, p: 1 }}>
                  <b> {t('Home')}</b>
                </Link>
                <Button component={Link} href="/app" variant="contained" sx={{ ml: 2 }}>
                  {t('Dashboard')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center">
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <BlogCard />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <BlogCard />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <BlogCard />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <BlogCard />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <BlogCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </BlogWrapper>
  )
}

export default Blog

Blog.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}
