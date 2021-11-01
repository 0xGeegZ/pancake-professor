import { Box, Button, Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import Link from 'src/client/components/Link'
import Logo from 'src/client/components/LogoSign'
import Hero from 'src/client/components/Overview/Hero'
import Highlights from 'src/client/components/Overview/Highlights'
import BaseLayout from 'src/client/layouts/BaseLayout'
import LanguageSwitcher from 'src/client/layouts/BoxedSidebarLayout/Header/Buttons/LanguageSwitcher'

import type { ReactElement } from 'react'

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(14)};
`
)

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
)

const Overview = () => {
  // const Overview: FC = () => {
  const router = useRouter()
  // const [account, setAccount] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()

  const { t }: { t: any } = useTranslation()

  // const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const connect = async (evt) => {
    evt.preventDefault()
    if (!window.ethereum?.request) {
      enqueueSnackbar(t('MetaMask is not installed!'), {
        variant: 'error',
      })
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    // setProvider(provider)
    // setAccount(accounts[0])

    enqueueSnackbar(t('Wallet succesfully connected!'), {
      variant: 'success',
    })
    const msg = 'Pancake Professor Application Sign Up'
    const signer = provider.getSigner()
    const signed = await signer.signMessage(msg)

    fetch(`/api/auth/web3Auth`, {
      method: `POST`,
      body: JSON.stringify({
        address: accounts[0],
        msg,
        signed,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          enqueueSnackbar(t('Redirecting to application dashboard!'), {
            variant: 'success',
          })
          router.push('/app', undefined, { shallow: true })
        } else {
          enqueueSnackbar(t('Unexpected error occurred during authentification'), {
            variant: 'error',
          })
        }
      })
  }

  return (
    <OverviewWrapper>
      <Head>
        <title>Pancake Professor</title>
      </Head>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box display="flex" alignItems="center" justifyContent="space-between" flex={1}>
              <Box />

              <Box>
                <LanguageSwitcher />
                <Link underline="hover" href="/blog" rel="noopener noreferrer" variant="body2" sx={{ ml: 2, p: 1 }}>
                  {t('Blog')}
                </Link>
                <Link underline="hover" href="/app" rel="noopener noreferrer" sx={{ ml: 2, p: 1 }}>
                  <b> {t('Dashboard')}</b>
                </Link>
                <Button component={Link} href="#" onClick={connect} variant="contained" sx={{ ml: 2 }}>
                  {t('Connect Wallet')}
                </Button>
                {/* <Button
                  component={Link}
                  href="/dashboards/analytics"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  {t('Live Preview')}
                </Button> */}
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Hero />
      <Highlights />
      <Footer />
    </OverviewWrapper>
  )
}

export default Overview

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>
}
