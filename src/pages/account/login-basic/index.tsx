import { Box, Card, Link, Typography, Container } from '@mui/material'
import Head from 'next/head'
import type { ReactElement } from 'react'
import BaseLayout from 'src/client/layouts/BaseLayout'
import LoginForm from 'src/client/components/Account/LoginForm'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Logo from 'src/client/components/LogoSign'

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

function LoginBasic() {
  const { t }: { t: any } = useTranslation()

  return (
    <>
      <Head>
        <title>Login - Basic</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Logo />
            <Card sx={{ mt: 3, px: 4, pt: 5, pb: 3 }}>
              <Box>
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
                <Link underline="hover" href="/account/register-basic">
                  <b>Sign up here</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  )
}

export default LoginBasic

LoginBasic.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}
