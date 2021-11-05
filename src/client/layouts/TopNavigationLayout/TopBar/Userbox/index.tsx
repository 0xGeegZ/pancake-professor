import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone'
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'src/client/components/Link'

const UserBoxButton = styled(Button)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 1)};
    color: ${theme.colors.alpha.trueWhite[50]};
    background-color: ${theme.colors.alpha.white[10]};
    height: 48px;
    border-radius: ${theme.general.borderRadiusLg};

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: ${theme.typography.pxToRem(24)};
      color: ${theme.colors.alpha.trueWhite[50]};
    }

    .MuiAvatar-root {
      border-radius: ${theme.general.borderRadiusLg};
      width: 34px;
      height: 34px;
    }

    &.Mui-active,
    &:hover {
      background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[100]};
      }
    }

    .MuiButton-label {
      justify-content: flex-start;
    }
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

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light};
`
)

const UserBoxDescriptionMain = styled(Typography)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[50]};
`
)

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.secondary.main};
    display: block;
`
)

const UserBoxLabelMain = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    display: block;
    color: ${theme.colors.alpha.trueWhite[100]};
`
)

function Userbox() {
  const { t }: { t: any } = useTranslation()

  const ref = useRef<any>(null)
  const [isOpen, setOpen] = useState<boolean>(false)

  const handleOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose()
      // await logout()
      // navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <UserBoxButton fullWidth color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
        <Box display="flex" flex={1} alignItems="center" justifyContent="space-between">
          <Hidden mdDown>
            <UserBoxText>
              <UserBoxLabelMain variant="body1">Margaret Gale</UserBoxLabelMain>
              <UserBoxDescriptionMain variant="body2">Lead Developer</UserBoxDescriptionMain>
            </UserBoxText>
          </Hidden>
          <UnfoldMoreTwoToneIcon fontSize="small" sx={{ ml: 1 }} />
        </Box>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}>
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
          <UserBoxText>
            <UserBoxLabel variant="body1">Margaret Gale</UserBoxLabel>
            <UserBoxDescription variant="body2">Lead Developer</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <ListItem
            onClick={() => {
              handleClose()
            }}
            button
            href="/management/users/1"
            component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
          <ListItem
            onClick={() => {
              handleClose()
            }}
            button
            href="/applications/projects-board"
            component={Link}>
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
  )
}

export default Userbox
