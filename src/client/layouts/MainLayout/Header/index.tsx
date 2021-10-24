import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Box, Button, CircularProgress, Grid, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'src/client/components/Link';
import Logo from 'src/client/components/Logo';
import { SidebarContext } from 'src/client/contexts/SidebarContext';
import { Erc20__factory } from 'src/client/contracts/types';
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated';
import useRefMounted from 'src/client/hooks/useRefMounted';

import LanguageSwitcher from './Buttons/LanguageSwitcher';
import HeaderUserbox from './Userbox';

const HeaderWrapper: FC = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(3)};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: space-between;
        width: 100%;
`
)

const Header = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const { t }: { t: any } = useTranslation()
  const isMountedRef = useRefMounted()

  const [{ data, fetching, error }] = useGetCurrentUserQuery()

  const router = useRouter()
  const [address, setAddress] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [user, setCurrentUser] = useState<any>('')
  const [balance, setBalance] = useState<string>('')

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const { enqueueSnackbar } = useSnackbar()

  const checkBalance = useCallback(async (address) => {
    if (!window.ethereum?.request) return

    const browserProvider = new ethers.providers.Web3Provider(window.ethereum)

    if (!browserProvider) return

    setProvider(browserProvider)

    const TOKEN_ADDR = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    const token = Erc20__factory.connect(TOKEN_ADDR, browserProvider.getSigner())

    const rawBalance = await token.balanceOf(address)
    const decimals = await token.decimals()

    const balance = ethers.utils.formatUnits(rawBalance, decimals)
    setBalance(balance)
    window.localStorage.setItem('balance', balance)
  }, [])

  useEffect(() => {
    // if (!isMountedRef.current) {
    //   return
    // }

    if (!data) return
    if (!data.currentUser) return

    setCurrentUser(data.currentUser)
    if (data.currentUser.address) {
      setAddress(data.currentUser.address)
      if (!localStorage.getItem('address')) {
        window.localStorage.setItem('address', data.currentUser.address)
      }
    }
    if (data.currentUser.name) setName(data.currentUser.name)
    if (data.currentUser.email) setEmail(data.currentUser.email)

    if (window.localStorage.getItem('balance')) setBalance(window.localStorage.getItem('balance'))
    else checkBalance(data.currentUser.address)
  }, [data, checkBalance])

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
    setProvider(provider)
    setAddress(accounts[0])

    window.localStorage.setItem('address', accounts[0])

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
          enqueueSnackbar(t('Wallet succesfully connected!'), {
            variant: 'success',
          })
          // router.replace(router.asPath)
          // setAddress(accounts[0])
          // router.reload(window?.location?.pathname)
          router.push('/app')
        } else {
          enqueueSnackbar(t('Unexpected error occurred during authentification'), {
            variant: 'error',
          })
        }
      })
      .catch(() => {
        enqueueSnackbar(t('Unexpected error occurred'), {
          variant: 'error',
        })
      })
  }
  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Hidden lgUp>
          <Logo />
        </Hidden>
        {/* <Hidden mdDown>
          <HeaderMenu />
        </Hidden> */}
      </Box>
      <Box display="flex" alignItems="center">
        {/* <HeaderButtons /> */}
        <Box sx={{ mr: 1.5 }}>
          {/* <HeaderSearch /> */}
          {/* <Box sx={{ mx: .5 }} component="span">
          {currentUser ? (<HeaderNotifications />) : (<></>)}
        </Box> */}
          <Hidden smDown>
            <LanguageSwitcher />
          </Hidden>
        </Box>
        {fetching ? (
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item>
              {/* TODO UPDATE PROGRESS COLOR TO WHITE */}
              <CircularProgress color="secondary" size="1rem" />
            </Grid>
          </Grid>
        ) : address ? (
          <>
            <HeaderUserbox address={address} balance={balance} />
            <Hidden lgUp>
              <Tooltip arrow title="Toggle Menu">
                <IconButton color="primary" onClick={toggleSidebar}>
                  {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                </IconButton>
              </Tooltip>
            </Hidden>
          </>
        ) : (
          <>
            <Button color="secondary" component={Link} href="#" onClick={connect} variant="contained" sx={{ ml: 2 }}>
              {t('Connect Wallet')}
            </Button>
          </>
        )}
      </Box>
    </HeaderWrapper>
  )
}

export default Header
