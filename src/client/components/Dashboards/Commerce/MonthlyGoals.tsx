import { Box, Button,Card, CardHeader, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function MonthlyGoals() {
  const { t }: { t: any } = useTranslation()

  return (
    <Card sx={{ pt: 1, px: 1 }}>
      <CardHeader
        title={
          <>
            {t('Monthly Goals')}{' '}
            <Typography variant="body2" component="span" fontWeight="bold" color="text.secondary">
              ({t('manual')})
            </Typography>
          </>
        }
        action={<Button size="small">{t('Setup')}</Button>}
      />
      <Box>
        <Grid container spacing={3}>
          <Grid item>
            <img src="/static/images/placeholders/illustrations/3.svg" alt="..." />
          </Grid>
          <Grid item display="flex" flexDirection="column" justifyContent="center">
            <Box>
              <Box sx={{ pb: 2 }}>
                <Typography variant="h3" gutterBottom>
                  {t('Achieved')}
                </Typography>
                <Typography variant="subtitle2">{t('30% of $5000 manual set goal')}</Typography>
              </Box>
              <Box>
                <Typography variant="h3" gutterBottom>
                  {t('Forecasted')}
                </Typography>
                <Typography variant="subtitle2">{t('February Sales:')} $32,594.00</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default MonthlyGoals
