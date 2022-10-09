import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Container, Divider, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Image from 'next/image'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from 'src/client/components/LogoSign'
import BaseLayout from 'src/client/layouts/BaseLayout'

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
)

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
)

const StatusMaintenance = () => {
  const { t }: { t: any } = useTranslation()

  return (
    <>
      <Head>
        <title>Status - Maintenance</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Logo />
            <Box textAlign="center">
              <Container maxWidth="xs">
                <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                  {t('The site is currently down for maintenance')}
                </Typography>
                <Typography variant="h3" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
                  {t('We apologize for any inconveniences caused')}
                </Typography>
              </Container>
              {/* <img alt="Maintenance" height={250} src="/static/images/status/maintenance.svg" /> */}
              <Image alt="Maintenance" height={250} width={350} src="/static/images/status/maintenance.svg" />
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography component="span" variant="subtitle1">
                  {t('Phone')}:{' '}
                </Typography>
                <Typography component="span" variant="subtitle1" color="text.primary">
                  + 00 1 888 555 444
                </Typography>
              </Box>
              <Box>
                <Tooltip arrow placement="top" title="Facebook">
                  <IconButton color="primary">
                    <FacebookIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Twitter">
                  <IconButton color="primary">
                    <TwitterIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Instagram">
                  <IconButton color="primary">
                    <InstagramIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  )
}

export default StatusMaintenance

StatusMaintenance.getLayout = (page: ReactElement) => {
  return <BaseLayout>{page}</BaseLayout>
}
