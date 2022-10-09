import { Box, Hidden } from '@mui/material'

import LanguageSwitcher from './LanguageSwitcher'
import HeaderNotifications from './Notifications'
import HeaderSearch from './Search'

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1.5 }}>
      <HeaderSearch />
      <Box sx={{ mx: 0.5 }} component="span">
        <HeaderNotifications />
      </Box>
      <Hidden smDown>
        <LanguageSwitcher />
      </Hidden>
    </Box>
  )
}

export default HeaderButtons
