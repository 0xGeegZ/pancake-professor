import { useRef, useState } from 'react';

import Link from 'src/client/components/Link';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Button,
  Divider,
  darken,
  alpha,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(2)};
    background-color: ${darken(theme.sidebar.menuItemBg, .05)};

    .MuiButton-label {
      justify-content: flex-start;
    }

    &:hover {
      background-color: ${darken(theme.sidebar.menuItemBg, .1)};
    }
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
    color: ${theme.sidebar.menuItemColor};
    display: block;

    &.popoverTypo {
      color: ${theme.palette.secondary.main};
    }
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${alpha(theme.sidebar.menuItemColor, .6)};

    &.popoverTypo {
      color: ${theme.palette.secondary.light};
    }
`
);

function SidebarTopSection() {
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
      handleClose();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <UserBoxButton fullWidth color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
        <Box
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <UserBoxText>
            <UserBoxLabel variant="body1">Margaret Gale</UserBoxLabel>
            <UserBoxDescription variant="body2">
              Lead Developer
            </UserBoxDescription>
          </UserBoxText>
          <UnfoldMoreTwoToneIcon fontSize="small" sx={{ ml: 1 }} />
        </Box>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
          <UserBoxText>
            <UserBoxLabel className="popoverTypo" variant="body1">Margaret Gale</UserBoxLabel>
            <UserBoxDescription className="popoverTypo" variant="body2">
              Lead Developer
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => { handleClose() }}
            button href="/management/users/1" component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
          <ListItem
            onClick={() => { handleClose() }}
            button
            href="/applications/projects-board"
            component={Link}
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Projects')} />
          </ListItem>
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

export default SidebarTopSection;
