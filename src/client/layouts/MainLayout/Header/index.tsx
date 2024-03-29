import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import { Box, Button, CircularProgress, Grid, Hidden, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'src/client/components/Link'
import Logo from 'src/client/components/Logo'
import { SidebarContext } from 'src/client/contexts/SidebarContext'

import LanguageSwitcher from './Buttons/LanguageSwitcher'
import HeaderUserbox from './Userbox'

const HeaderWrapper = styled(Box)(
  // const HeaderWrapper: FC = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(3)};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        position: relative;
        justify-content: space-between;
        width: 100%;
`
)

// const Header = ({ connect, logout, user, balance, fetching, error }) => {
const Header = ({ connect, logout, user, fetching }) => {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const { t }: { t: any } = useTranslation()

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

        <Hidden lgUp>
          <Box sx={{ mr: 1.5 }}>
            <Tooltip arrow title="Toggle Menu">
              <IconButton color="primary" onClick={toggleSidebar}>
                {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Hidden>
        {fetching ? (
          <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item>
              <CircularProgress color="secondary" size="1rem" />
            </Grid>
          </Grid>
        ) : user ? (
          <>
            {/* <HeaderUserbox logout={logout} address={user?.address} balance={user.balance} /> */}
            <HeaderUserbox logout={logout} address={user?.generated} balance={user.generatedBalance} />
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
