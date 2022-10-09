import { Box } from '@mui/material'

import LanguageSwitcher from './LanguageSwitcher'
import HeaderNotifications from './Notifications'

function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderNotifications />
      <LanguageSwitcher />
    </Box>
  )
}

export default HeaderButtons
