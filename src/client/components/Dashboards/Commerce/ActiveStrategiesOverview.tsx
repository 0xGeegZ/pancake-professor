import 'moment-timezone'

import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone'
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const ArrowUpwardWrapper = styled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
)

const ArrowDownwardWrapper = styled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
)

function ActiveStrategiesOverview({ strategies }) {
  const { t }: { t: any } = useTranslation()

  const getBankrollFromStrategies = (strategies) => {
    if (!strategies.length) return 0

    return strategies
      .map((s) => +s.currentAmount)
      .reduce((acc, num) => acc + num, 0)
      .toFixed(4)
  }

  const getActiveSinceFromStrategies = (strategies) => {
    if (!strategies.length) return 0

    let dates = strategies.map((s) => +s.createdAt).sort((a, b) => a.getTime() - b.getTime())
    console.log('🚀 ~ file: ActiveStrategiesOverview.tsx ~ line 36 ~ getActiveSinceFromStrategies ~ dates', dates)

    const lastDate = dates[0]

    const duration = moment.duration(moment().diff(moment(lastDate)))

    // Get Days
    const days = Math.floor(duration.asDays())
    const daysFormatted = days ? `${days}d ` : ''

    // Get Hours
    const hours = duration.hours()
    const hoursFormatted = `${hours}h `

    // Get Minutes
    // const minutes = duration.minutes()
    // const minutesFormatted = `${minutes}m`

    return [daysFormatted, hoursFormatted].join('')
  }

  return (
    <Card sx={{ pt: 1, px: 1, height: '100%' }}>
      <CardHeader
        title={
          <>
            {t('Strategies overview')}{' '}
            {/* <Typography variant="body2" component="span" fontWeight="bold" color="text.secondary">
              ({strategies.length} {t('strategies')})
            </Typography> */}
          </>
        }
      />
      <CardContent>
        <Box
          sx={{
            px: { lg: 4 },
            pb: 2,
            height: '100%',
            flex: 1,
            textAlign: 'center',
          }}>
          <Grid spacing={3} container>
            <Grid xs={12} sm item>
              <Typography variant="caption" gutterBottom>
                {t('Strategies')}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {strategies.length}
              </Typography>
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pt: 1,
                }}>
                <Label color="success">7%</Label>
                <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
              </Box> */}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid xs={12} sm item>
              <Typography variant="caption" gutterBottom>
                {t('Bankroll')}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {getBankrollFromStrategies(strategies)}
              </Typography>
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pt: 1,
                }}>
                <Label color="success">8%</Label>
                <ArrowDownwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
              </Box> */}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid xs={12} sm item>
              <Typography variant="caption" gutterBottom>
                {t('Active since')}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {getActiveSinceFromStrategies(strategies)}
              </Typography>
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pt: 1,
                }}>
                <Label color="success">17%</Label>
                <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
              </Box>  */}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

ActiveStrategiesOverview.propTypes = {
  strategies: PropTypes.arrayOf(PropTypes.shape({})),
}

ActiveStrategiesOverview.defaultProps = {
  strategies: [],
}

export default ActiveStrategiesOverview
