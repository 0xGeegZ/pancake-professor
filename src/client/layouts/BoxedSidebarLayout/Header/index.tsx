import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Box, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, useRef, useState, useEffect, useContext} from 'react';
import Logo from 'src/client/components/Logo';
import { SidebarContext } from 'src/client/contexts/SidebarContext';
import { CircularProgress, Grid ,Button} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';


import HeaderButtons from './Buttons';
import HeaderMenu from './Menu';
import HeaderSearch from './Buttons/Search';
import LanguageSwitcher from './Buttons/LanguageSwitcher';

import HeaderNotifications from './Buttons/Notifications';
import HeaderUserbox from './Userbox';
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated';
import Link from 'src/client/components/Link';

const HeaderWrapper : FC = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(3)};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: space-between;
        width: 100%;
`
);

const Header = () => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const { t }: { t: any } = useTranslation();

  const [{ data, fetching, error }] = useGetCurrentUserQuery();
    const router = useRouter();
    const [address, setAddress] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [user, setCurrentUser] = useState<string>("");
    const [account, setAccount] = useState<string>("");

    const { enqueueSnackbar } = useSnackbar();

    const currentUser = data?.currentUser;
  
     // Once we load the current user, default the name input to their name
     useEffect(() => {
      if (currentUser?.address) setAddress(currentUser.address);
      if (currentUser?.name) setName(currentUser.name);
      if (currentUser?.email) setEmail(currentUser.email);
    }, [currentUser]);
  
    useEffect(() => {
      if (data?.currentUser) {
        // setCurrentUser(data.currentUser)
        if (currentUser?.address) setAddress(data?.currentUser.address);
        if (currentUser?.name) setName(data?.currentUser.name);
        if (currentUser?.email) setEmail(data?.currentUser.email);
      }
    }, [data]);


    const [provider, setProvider] = useState<ethers.providers.Web3Provider>();


    const connect = async (evt) => {
      evt.preventDefault();
      if (!window.ethereum?.request) {
        enqueueSnackbar(t('MetaMask is not installed!'), {
          variant: 'error'
        });
         return;
      }
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setProvider(provider);
      setAccount(accounts[0]);
  
     
      const msg = "Pancake Professor Application Sign Up";
      const signer = provider.getSigner()
      const signed = await signer.signMessage(msg);
  
      fetch(`/api/auth/web3Auth`, {
        method: `POST`,
        body: JSON.stringify({
          address: accounts[0],
          msg,
          signed,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            enqueueSnackbar(t('Wallet succesfully connected!'), {
              variant: 'success'
            });  
             router.replace(router.asPath);
          }else {
            enqueueSnackbar(t('Unexpected error occurred'), {
              variant: 'error'
            });
          }
        });
    };
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
          <Box sx={{ mx: .5 }} component="span">
          {currentUser ? (<HeaderNotifications />) : (<></>)}
        </Box>
        <Hidden smDown>
          <LanguageSwitcher />
        </Hidden>
      </Box>
      {fetching ? 
      (<Grid container
             direction="row"
             justifyContent="center"
             alignItems="stretch"
             spacing={3}>
             <Grid item>
               {/* TODO UPDATE PROGRESS COLOR TO WHITE */}
                <CircularProgress  color="secondary" size="1rem" />
             </Grid>
         </Grid>) : currentUser ? 
        (<> 
        <HeaderUserbox />
        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Hidden>
        </>) : 
       (<>
        <Button
          color="secondary"
          component={Link}
          href="#"
          onClick={connect}
          variant="contained"
          sx={{ ml: 2 }}
        >
          {t('Connect Wallet')}
        </Button>
        </>)}
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
