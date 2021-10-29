import { Card, Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import VisitorsOverviewChart from './VisitorsOverviewChart'

const VisitorsOverviewChartWrapper = styled(VisitorsOverviewChart)(
  () => `
        height: 230px;
`
)

function VisitorsOverview() {
  const { t }: { t: any } = useTranslation()

  const visitors = {
    visitors: [434, 827, 123, 367, 818, 833, 860],
    revenue: [434, 108, 912, 767, 855, 840, 756],
  }

  const generic = {
    month: {
      labels: ['Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
  }

  const data = {
    visitors: '23.584',
    conversion: '7.23%',
    revenue: '$18.12',
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3 }}>
        <Box height={230} sx={{ px: { lg: 4 } }}>
          <VisitorsOverviewChartWrapper data={visitors} labels={generic.month.labels} />
        </Box>
        <Box
          sx={{
            px: { lg: 4 },
            pt: 4,
            pb: 2,
            height: '100%',
            flex: 1,
            textAlign: 'center',
          }}>
          <Grid spacing={3} container>
            <Grid item md={4}>
              <Typography variant="caption" gutterBottom>
                {t('Visitors')}
              </Typography>
              <Typography variant="h3">{data.visitors}</Typography>
            </Grid>
            <Grid item md={4}>
              <Typography variant="caption" gutterBottom>
                {t('Conversion')}
              </Typography>
              <Typography variant="h3">{data.conversion}</Typography>
            </Grid>
            <Grid item md={4}>
              <Typography variant="caption" gutterBottom>
                {t('Revenue/Visitor')}
              </Typography>
              <Typography variant="h3">{data.revenue}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  )
}

export default VisitorsOverview
