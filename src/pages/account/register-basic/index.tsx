import {
  Box,
  Card,
  Link,
  Typography,
  Container,
} from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';
import BaseLayout from "src/client/layouts/BaseLayout";
import RegisterForm from 'src/client/components/Account/RegisterForm';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Logo from 'src/client/components/LogoSign';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

function RegisterBasic() {

  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Register - Basic</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Logo />
            <Card sx={{ mt: 3, px: 4, pt: 5, pb: 3 }}>
              <Box>
                <Typography variant="h2" sx={{ mb: 1 }}>
                  {t('Create account')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 3 }}
                >
                  {t('Fill in the fields below to sign up for an account.')}
                </Typography>
              </Box>
              <RegisterForm />
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {t('Already have an account?')}
                </Typography>{' '}
                <Link underline="hover" href="/account/login-basic">
                  <b>Sign in here</b>
                </Link>
              </Box>
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default RegisterBasic;

RegisterBasic.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseLayout>
      {page}
    </BaseLayout>
  )
}