import { Box } from '@mui/material'

import LanguageSwitcher from './LanguageSwitcher'
import HeaderNotifications from './Notifications'

function HeaderButtons() {
  return (
    <Box>
      <HeaderNotifications />
      <LanguageSwitcher />
    </Box>
  )
}

export default HeaderButtons
