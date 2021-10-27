import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { alpha, Box, Button, Card, CircularProgress, Grid, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'src/client/components/Link';
import { SidebarContext } from 'src/client/contexts/SidebarContext';
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated';

import LanguageSwitcher from './Buttons/LanguageSwitcher';
import HeaderNotifications from './Buttons/Notifications';
import Logo from './Logo';
import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    height: ${theme.header.height};
    color: ${theme.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background-color: ${theme.colors.primary.main};
    position: fixed;
    justify-content: space-between;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 0;
`
)

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    color: ${theme.colors.alpha.trueWhite[70]};
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 100%;
    margin-left: ${theme.spacing(2)};

    &.active,
    &:active,
    &:hover {
      background: ${alpha(theme.colors.alpha.trueWhite[30], 0.2)};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
)

const BoxLogoWrapper = styled(Box)(
  ({ theme }) => `
  margin-right: ${theme.spacing(2)};

  @media (min-width: ${theme.breakpoints.values.lg}px) {
    width: calc(${theme.sidebar.width} - ${theme.spacing(4)});
  }
    
`
)

const Header: FC = () => {
  const { t }: { t: any } = useTranslation()

  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)

  const [{ data, fetching, error }] = useGetCurrentUserQuery()
  //   const router = useRouter();
  const [address, setAddress] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const [account, setAccount] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()

  const currentUser = data?.currentUser

  // Once we load the current user, default the name input to their name
  useEffect(() => {
    if (currentUser?.address) setAddress(currentUser.address)
    if (currentUser?.name) setName(currentUser.name)
    if (currentUser?.email) setEmail(currentUser.email)
  }, [currentUser])

  useEffect(() => {
    if (data?.currentUser) {
      // setUser(data.currentUser)
      if (currentUser?.address) setAddress(data?.currentUser.address)
      if (currentUser?.name) setName(data?.currentUser.name)
      if (currentUser?.email) setEmail(data?.currentUser.email)
    }
  }, [data])

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

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
    setAccount(accounts[0])

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
        } else {
          enqueueSnackbar(t('Unexpected error occurred'), {
            variant: 'error',
          })
        }
      })
  }

  return (
    <HeaderWrapper>
      <Box display="flex" alignItems="center">
        <BoxLogoWrapper>
          <Logo />
        </BoxLogoWrapper>
        {/* <Hidden smDown>
          <HeaderSearch />
        </Hidden> */}
      </Box>
      <Box display="flex" alignItems="center">
        <Box sx={{ mr: 1 }}>
          {currentUser ? <HeaderNotifications /> : <></>}
          <LanguageSwitcher />
        </Box>
        {fetching ? (
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item>
              {/* TODO UPDATE PROGRESS COLOR TO WHITE */}
              <CircularProgress color="secondary" size="1rem" />
            </Grid>
          </Grid>
        ) : currentUser ? (
          <>
            {/* <HeaderButtons /> */}
            <HeaderUserbox />
            <Hidden lgUp>
              <Tooltip arrow title="Toggle Menu">
                <IconButtonPrimary color="primary" onClick={toggleSidebar}>
                  {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
                </IconButtonPrimary>
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
