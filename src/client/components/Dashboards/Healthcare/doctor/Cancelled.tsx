import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Label from 'src/client/components/Label'

import CancelledChart from './CancelledChart'

const CancelledChartWrapper = styled(CancelledChart)(
  () => `
        height: 200px;
        maxWidth: 300px;
`
)

function Cancelled() {
  const { t }: { t: any } = useTranslation()

  const cancelled = {
    visitors: [34, 27, 23, 67, 18, 33, 60],
    revenue: [34, 18, 12, 67, 55, 40, 56],
  }

  const generic = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Card sx={{ p: 3 }}>
      <Box height={200} sx={{ mx: 'auto', px: { xl: 4 } }}>
        <CancelledChartWrapper data={cancelled} labels={generic} />
      </Box>
      <Box display="flex" alignItems="center" sx={{ pt: 2, pb: 1 }} justifyContent="center">
        <Typography variant="h3" align="center" sx={{ mr: 1 }}>
          {t('Cancelled')}
        </Typography>
        <Label color="error">
          <b>-5%</b>
        </Label>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h1" align="center" sx={{ mr: 1 }}>
          3
        </Typography>
        <Typography variant="subtitle2">{t('Today')}</Typography>
      </Box>
    </Card>
  )
}

export default Cancelled
