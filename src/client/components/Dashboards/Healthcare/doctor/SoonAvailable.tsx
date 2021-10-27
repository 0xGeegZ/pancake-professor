import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      box-shadow: ${theme.colors.shadows.error};
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

function SoonAvailable() {
  const { t }: { t: any } = useTranslation()

  return (
    <RootWrapper sx={{ display: { xs: 'block', sm: 'flex' } }}>
      <Box display="flex" alignItems="center">
        <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
          <AccessTimeFilledIcon />
        </AvatarSuccess>
        <Box>
          <TypographyPrimary variant="h5">{t('Soon Available')}</TypographyPrimary>
          <TypographySecondary variant="subtitle2">{t('This section is still in developpment!')}</TypographySecondary>
        </Box>
      </Box>
      <Box sx={{ pt: { xs: 2, sm: 0 } }}>
        <ButtonTransparent href="/app" variant="contained">
          {t('Go back to app')}
        </ButtonTransparent>
      </Box>
    </RootWrapper>
  )
}

export default SoonAvailable
