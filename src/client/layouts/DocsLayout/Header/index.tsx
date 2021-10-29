import { Card, Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Link from 'src/client/components/Link'

import Logo from 'src/client/components/Logo'

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    z-index: 6;
    top: 0;
    padding: 0 ${theme.spacing(2)};
    height: ${theme.spacing(10)};
`
)

function Header() {
  const { t }: { t: any } = useTranslation()

  return (
    <HeaderWrapper>
      <Logo />
      <Box>
        <Button component={Link} href="/dashboards/analytics" variant="contained" sx={{ mx: 2 }}>
          {t('View Live Preview')}
        </Button>
      </Box>
    </HeaderWrapper>
  )
}

export default Header
