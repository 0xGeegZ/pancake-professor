import 'moment-timezone'

import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import { Box, Card, CardContent, CardHeader, Divider, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AllStrategiesChart from './AllStrategiesChart'

const AllStrategiesChartWrapper = styled(AllStrategiesChart)(
  () => `
    width: 100%;
    height: 100%;
`
)

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

function AllStrategies({ strategies }) {
  const { t }: { t: any } = useTranslation()
  const actionRef1 = useRef<any>(null)
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const theme = useTheme()

  const periods = [
    {
      value: 'today',
      text: t('Today'),
    },
    {
      value: 'yesterday',
      text: t('Yesterday'),
    },
    {
      value: 'last_month',
      text: t('Last month'),
    },
    {
      value: 'last_year',
      text: t('Last year'),
    },
  ]

  const [period, setPeriod] = useState<string>(periods[2].text)
  const [data, setData] = useState()

  const getActivesStrategiesCount = () => {
    if (!strategies.length) return 0
    return `${strategies.filter((s) => s.isActive).length}`
  }

  const getBankrollFromStrategies = () => {
    if (!strategies.length) return 0

    return `${strategies
      .map((s) => +s.currentAmount)
      .reduce((acc, num) => acc + num, 0)
      .toFixed(4)} BNB`
  }

  const getActiveSinceFromStrategies = () => {
    if (!strategies.length) return 0

    const dates = strategies.map((s) => new Date(s.createdAt)).sort((a, b) => a.getTime() - b.getTime())

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

  useEffect(() => {
    if (data) return

    if (!strategies) return

    const totalBnb = strategies
      .map((s) => s.currentAmount)
      .reduce((acc, num) => acc + num, 0)
      .toFixed(4)

    if (+totalBnb === 0) return

    const amountsPercent = strategies.map((s) => parseInt(`${(s.currentAmount * 100) / totalBnb}`, 10))
    const amountsValue = strategies.map((s) => +s.currentAmount.toFixed(2))
    const labels = strategies.map((s) => s.player.substring(0, 10))
    const ldata = {
      datasets: [
        {
          data: amountsPercent,
          amountsPercent,
          amountsValue,
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.error.main,
          ],
          hoverBackgroundColor: [
            theme.palette.primary.light,
            theme.palette.success.light,
            theme.palette.warning.light,
            theme.palette.info.light,
            theme.palette.error.light,
          ],
          hoverBorderColor: [
            theme.colors.primary.lighter,
            theme.colors.success.lighter,
            theme.colors.warning.lighter,
            theme.colors.info.lighter,
            theme.colors.error.lighter,
          ],
        },
      ],
      // labels: [t('Bills'), t('Helath'), t('Education'), t('Entertainment'), t('Others')],
      labels,
    }
    setData(ldata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, strategies])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={
          <Tooltip arrow title={t('View all Strategies')}>
            <IconButton size="small" color="primary" href="#">
              <ChevronRightTwoToneIcon />
            </IconButton>
          </Tooltip>
        }
        title={t('Strategies resume')}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            px: { lg: 4 },
            pt: 2,
            pb: 4,
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
                {getActivesStrategiesCount()}
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
                {t('Used bankroll')}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {getBankrollFromStrategies()}
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
                {getActiveSinceFromStrategies()}
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
        {data && (
          <>
            <Divider sx={{ mb: 3 }} />
            {/* <Button
          size="small"
          variant="outlined"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
          {period}
        </Button>
        <Menu
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}>
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                setPeriod(_period.text)
                setOpenMenuPeriod(false)
              }}>
              {_period.text}
            </MenuItem>
          ))}
        </Menu> */}

            <Grid pt={3} container spacing={3}>
              <Grid md={6} item display="flex" justifyContent="center" alignItems="center">
                <Box style={{ width: '200px', height: '200px' }}>
                  <AllStrategiesChartWrapper data={data} />
                </Box>
              </Grid>
              <Grid md={6} item display="flex" alignItems="center">
                <Box>
                  {data?.labels.map((label: string, i: number) => (
                    <Typography
                      key={label}
                      variant="body2"
                      sx={{
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        mr: 2,
                      }}>
                      <DotLegend
                        style={{
                          background: `${data?.datasets[0].backgroundColor[i]}`,
                        }}
                      />
                      <span
                        style={{
                          paddingRight: 6,
                          fontSize: `${theme.typography.pxToRem(11)}`,
                          color: `${data?.datasets[0].backgroundColor[i]}`,
                        }}>
                        {data?.datasets[0].data[i]}%
                      </span>
                      {label}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}

AllStrategies.defaultProps = {
  strategies: [],
}
export default AllStrategies
