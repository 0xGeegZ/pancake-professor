import { Card, CardContent, CardHeader, Divider, Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Label from 'src/client/components/Label'
import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone'
import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import PropTypes from 'prop-types'

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

  const data = {
    visitors: '65.485',
    conversion: '15.65%',
    revenue: '$8,486',
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
                {strategies.length}
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
                {strategies.length} days
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
