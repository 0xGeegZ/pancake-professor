import logout from '@/pages/api/auth/logout';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { Box, Button, Divider, Hidden, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'src/client/components/Link';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 0.5)};
    height: ${theme.spacing(6)};
`
)

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
)

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
)

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
)

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
)

function HeaderUserbox({ address, balance, logout }) {
  const { enqueueSnackbar } = useSnackbar()

  const { t }: { t: any } = useTranslation()

  const router = useRouter()

  const ref = useRef<any>(null)
  const [isOpen, setOpen] = useState<boolean>(false)

  const handleOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleLogout = async (): Promise<void> => {
    handleClose()
    logout()
  }

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <AccountCircleIcon />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{address?.substring(0, 10)}</UserBoxLabel>
            <UserBoxDescription variant="body2">{balance || 0}BNB</UserBoxDescription>
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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <AccountCircleIcon />

          <UserBoxText>
            <UserBoxLabel variant="body1">{address?.substring(0, 10)}</UserBoxLabel>
            <UserBoxDescription variant="body2">{balance}BNB</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => {
              handleClose()
            }}
            button
            href="/app/account"
            component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Settings')} />
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
  )
}

export default HeaderUserbox
