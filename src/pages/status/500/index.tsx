import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, Container, Grid, Hidden, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BaseLayout from 'src/client/layouts/BaseLayout'

import type { ReactElement } from 'react'

const GridWrapper = styled(Grid)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
`
)

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
)

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[100]};
`
)

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.white[70]};
`
)

function Status500() {
  const { t }: { t: any } = useTranslation()

  const [pending, setPending] = useState(false)

  const handleClick = () => {
    setPending(true)
  }

  return (
    <>
      <Head>
        <title>Status - 500</title>
      </Head>
      <MainContent>
        <Grid container sx={{ height: '100%' }} alignItems="stretch" spacing={0}>
          <Grid xs={12} md={6} alignItems="center" display="flex" justifyContent="center" item>
            <Container maxWidth="sm">
              <Box textAlign="center">
                {/* <img alt="500" height={260} src="/static/images/status/500.svg" /> */}
                <Image alt="500" height={260} width={350} src="/static/images/status/500.svg" />

                <Typography variant="h2" sx={{ my: 2 }}>
                  {t('There was an error, please try again later')}
                </Typography>
                <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
                  {t('The server encountered an internal error and was not able to complete your request')}
                </Typography>
                <LoadingButton
                  onClick={handleClick}
                  loading={pending}
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshTwoToneIcon />}>
                  {t('Refresh view')}
                </LoadingButton>
                <Button href="/" variant="contained" sx={{ ml: 1 }}>
                  {t('Go back')}
                </Button>
              </Box>
            </Container>
          </Grid>
          <Hidden mdDown>
            <GridWrapper xs={12} md={6} alignItems="center" display="flex" justifyContent="center" item>
              <Container maxWidth="sm">
                <Box textAlign="center">
                  <TypographyPrimary variant="h1" sx={{ my: 2 }}>
                    {t('Pancake Professor')}
                  </TypographyPrimary>
                  <TypographySecondary variant="h4" fontWeight="normal" sx={{ mb: 4 }}>
                    {t('Play to pancake prediction like the bests.')}
                  </TypographySecondary>
                  <Button href="/" size="large" variant="contained">
                    {t('Overview')}
                  </Button>
                </Box>
              </Container>
            </GridWrapper>
          </Hidden>
        </Grid>
      </MainContent>
    </>
  )
}

export default Status500

Status500.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}
