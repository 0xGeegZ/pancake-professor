import { Box, Card, Container, Hidden, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useTranslation } from 'react-i18next'
import LoginForm from 'src/client/components/Account/LoginForm'
import Logo from 'src/client/components/Logo'
import BaseLayout from 'src/client/layouts/BaseLayout'

import type { ReactElement } from 'react'

const Content = styled(Box)(
  () => `
    display: flex;
    height: 100%;
    width: 100%;
`
)

const MainContent = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: ${theme.spacing(6)};
`
)

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
    width: 440px;
    height: 100%;
`
)

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: ${theme.spacing(6)};
`
)

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(33)};
`
)

function LoginCover() {
  const { t }: { t: any } = useTranslation()

  return (
    <>
      <Head>
        <title>Login - Cover</title>
      </Head>
      <Content>
        <Hidden mdDown>
          <SidebarWrapper>
            <Scrollbars universal autoHide>
              <SidebarContent>
                <Logo />
                <Box mt={6}>
                  <TypographyH1 variant="h1" sx={{ mb: 4 }}>
                    {t('Pancake Professor')}
                  </TypographyH1>
                  <Typography variant="subtitle1" sx={{ my: 3 }}>
                    {t(
                      'Production-ready updated admin dashboard powered by React and Material-UI built on NextJS features hundreds of components and examples that will help you build faster and better apps.'
                    )}
                  </Typography>
                  <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                    {t('Documentation')}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t('Learn how to get started with this Next.js admin dashboard template')}.{' '}
                    <Link target="_blank" rel="noopener" underline="hover" href="/docs">
                      Read docs
                    </Link>
                  </Typography>
                </Box>
              </SidebarContent>
            </Scrollbars>
          </SidebarWrapper>
        </Hidden>
        <MainContent>
          <Container maxWidth="sm">
            <Card sx={{ px: 4, py: 5 }}>
              <Box textAlign="center">
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {t('Sign in')}
                </Typography>
                <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 3 }}>
                  {t('Fill in the fields below to sign into your account.')}
                </Typography>
              </Box>
              <LoginForm />
              <Box my={4}>
                <Typography component="span" variant="subtitle2" color="text.primary" fontWeight="bold">
                  {t('Don’t have an account, yet?')}
                </Typography>{' '}
                <Link underline="hover" href="/account/register-cover">
                  <b>Sign up here</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  )
}

export default LoginCover

LoginCover.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}
