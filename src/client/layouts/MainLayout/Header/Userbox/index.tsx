import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { Avatar, Box, Button, Divider, Hidden, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'src/client/components/Link';
import { Erc20__factory } from 'src/client/contracts/types';
import useRefMounted from 'src/client/hooks/useRefMounted';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, .5)};
    height: ${theme.spacing(6)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

function HeaderUserbox({address}) {
  const [balance, setBalance] = useState<string>("");
  const isMountedRef = useRefMounted();

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  

  const checkBalance = useCallback(async () => {
    if (!window.ethereum?.request)
       return;

    if (!isMountedRef.current) {
      return;
    }

    if(!provider){
      return;
    }
  

    const TOKEN_ADDR = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
    const token = Erc20__factory.connect(TOKEN_ADDR, provider.getSigner());

    const rawBalance = await token.balanceOf(address);
    const decimals = await token.decimals();

    const balance = ethers.utils.formatUnits(rawBalance, decimals);
    setBalance(balance);

    window.localStorage.setItem('balance', balance);
  }, [address, provider])

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    
    // if (window.localStorage.getItem("balance"))
    //   setBalance(window.localStorage.getItem("balance"));
    // else
      checkBalance()
  }, [checkBalance])

  
  const { enqueueSnackbar } = useSnackbar();

  const { t }: { t: any } = useTranslation();

  const router = useRouter();

  

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      fetch(`/api/auth/logout`, {
        method: `GET`,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          handleClose();
          if (json.success) {
            router.push('/');
            enqueueSnackbar(t('Wallet succesfully unconnected!'), {
              variant: 'success'
            });     
          }else {
            enqueueSnackbar(t('Unexpected error occurred'), {
              variant: 'error'
            });
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{address.substring(0,10)}</UserBoxLabel>
            <UserBoxDescription variant="body2">
             {balance || 0 }BNB
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
          <UserBoxText>
            <UserBoxLabel variant="body1">{address.substring(0,10)}</UserBoxLabel>
            <UserBoxDescription variant="body2">
            {balance}BNB
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => { handleClose() }}
            button href="/app/account" component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
          {/* <ListItem
            onClick={() => { handleClose() }}
            button
            href="/applications/projects-board"
            component={Link}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Projects')} />
          </ListItem> */}
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
