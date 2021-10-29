import {
  Button,
  Box,
  Divider,
  CardHeader,
  Typography,
  Avatar,
  Grid,
  Rating,
  Card,
  Hidden,
  CardContent,
  CardActions,
} from '@mui/material'
import Link from 'src/client/components/Link'

import { useTranslation } from 'react-i18next'
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone'

import { styled, useTheme } from '@mui/material/styles'

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

const IndicatorWrapper = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.primary.main};
    border-radius: 100px;
    height: 8px;
    width: 56px;
    margin: ${theme.spacing(1)} 0;
`
)

const CardActionsWrapper = styled(CardActions)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    display: block;
    padding: ${theme.spacing(2)};
`
)

const BoxUpgrade = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
    padding: ${theme.spacing(3)} ${theme.spacing(17)} ${theme.spacing(3)} ${theme.spacing(3)};
    position: relative;
    border-radius: ${theme.general.borderRadius};
    
    img {
      position: absolute;
      bottom: 0;
      right: 0;
    }
`
)

function HealthcareSidebar() {
  const { t }: { t: any } = useTranslation()
  // const { user } = useAuth();
  const theme = useTheme()

  return (
    <Box p={3}>
      <Button
        component={Link}
        href="/dashboards/healthcare/hospital"
        variant="contained"
        fullWidth
        endIcon={<ArrowForwardTwoToneIcon fontSize="small" />}>
        {t('Switch to Hospital View')}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Avatar
          sx={{
            mx: 'auto',
            mb: 2,
            mt: 4,
            width: theme.spacing(12),
            height: theme.spacing(12),
          }}
          variant="rounded"
          alt="Margaret Gale"
          src="/static/images/avatars/1.jpg"
        />
        <Typography variant="h3" gutterBottom noWrap>
          Margaret Gale
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {t('Neurosurgeon')}
        </Typography>
      </Box>
      <Divider sx={{ mt: 3 }} />
      <Box>
        <Grid container spacing={0}>
          <Grid xs={12} md item>
            <Box p={2}>
              <Typography variant="h4" sx={{ pb: 1 }} noWrap gutterBottom>
                {t('Overall Rating')}
              </Typography>
              <Typography variant="h2" noWrap gutterBottom>
                4.9
              </Typography>
              <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
            </Box>
          </Grid>
          <Hidden lgDown>
            <Divider orientation="vertical" sx={{ mx: 3 }} flexItem />
          </Hidden>
          <Grid xs={12} md item>
            <Box p={2}>
              <Typography variant="h4" sx={{ pb: 2 }} noWrap gutterBottom>
                {t('Total Patients')}
              </Typography>
              <Typography variant="h2" noWrap gutterBottom>
                275
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Card>
        <CardHeader title={t('Revenue')} />
        <Divider />
        <CardContent>
          <Typography variant="h2">$15,394.58</Typography>
          <IndicatorWrapper />
          <Typography variant="subtitle2">{t('This month')}</Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h2">$784.34</Typography>
          <IndicatorWrapper />
          <Typography variant="subtitle2">{t('This week')}</Typography>
        </CardContent>
        <CardActionsWrapper>
          <Box>
            <Typography variant="caption" component="div" gutterBottom>
              {t('Total')}
            </Typography>
            <Typography variant="h3">$67,384.58</Typography>
          </Box>
        </CardActionsWrapper>
      </Card>

      <BoxUpgrade sx={{ my: 4 }}>
        <TypographyPrimary variant="h2" sx={{ pb: 1 }}>
          {t('Upgrade to PRO Account')}
        </TypographyPrimary>
        <TypographySecondary variant="subtitle2" sx={{ pb: 3 }}>
          {t('Start your PRO subscription today for as low as $5/month')}
        </TypographySecondary>
        <Button variant="contained" size="small">
          {t('Learn more')}
        </Button>
        <img src="/static/images/placeholders/illustrations/6.png" alt="..." />
      </BoxUpgrade>
    </Box>
  )
}

export default HealthcareSidebar
