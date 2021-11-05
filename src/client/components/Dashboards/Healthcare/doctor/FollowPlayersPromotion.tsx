import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import { Avatar, Box, Button, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const ButtonTransparent = styled(Button)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[10]};
    color: ${theme.colors.alpha.trueWhite[70]};

    &:hover {
      background: ${theme.colors.alpha.white[30]};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
)

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      box-shadow: ${theme.colors.shadows.success};
`
)

const RootWrapper = styled(Card)(
  ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: ${theme.colors.gradients.blue3};
      color:  ${theme.colors.alpha.white[100]};
      padding: ${theme.spacing(2)};
`
)

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
)

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
)

function FollowPlayersPromotion() {
  const { t }: { t: any } = useTranslation()

  return (
    <RootWrapper sx={{ display: { xs: 'block', sm: 'flex' } }}>
      <Box display="flex" alignItems="center">
        <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
          <AutoGraphIcon />
        </AvatarSuccess>
        <Box>
          <TypographyPrimary variant="h5">{t('Play like the best')}</TypographyPrimary>
          <TypographySecondary variant="subtitle2">
            {t('Automate your games by following best players mooves!')}
          </TypographySecondary>
        </Box>
      </Box>
      <Box sx={{ pt: { xs: 2, sm: 0 } }}>
        <ButtonTransparent href="/app/players" variant="contained">
          {t('Follow best players')}
        </ButtonTransparent>
      </Box>
    </RootWrapper>
  )
}

export default FollowPlayersPromotion
