import { useRef, useState } from 'react'
import { Button, Card, Box, CardContent, CardHeader, Menu, MenuItem, Typography, Divider, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import PlayerHistoryStatisticsChart from './PlayerHistoryStatisticsChart'

const PlayerHistoryStatisticsChartWrapper = styled(PlayerHistoryStatisticsChart)(
  () => `
        height: 200px;
`
)

const DotPrimaryLight = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.secondary.light};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

const DotPrimary = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.success.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

function PlayerHistoryStatistics({ player, updateDataForPeriod, multiplier }) {
  const { t }: { t: any } = useTranslation()

  const data = {
    totalWon: player?.statistics?.totalWon,
    totalLoss: player?.statistics?.totalLoss,
    totalPlayed: player?.statistics?.totalPlayed,
  }

  const labels = player?.statistics?.weekLabels || []

  const periods = [
    {
      value: 'today',
      text: t('Today'),
      multiplier: 1,
    },
    {
      value: 'last_three_days',
      text: t('Last three days'),
      multiplier: 3,
    },
    {
      value: 'last_week',
      text: t('Last week'),
      multiplier: 7,
    },
    {
      value: 'last_month',
      text: t('Last month'),
      multiplier: 30,
    },
    {
      value: 'ever',
      text: t('Ever'),
      multiplier: 1000,
    },
  ]

  const actionRef1 = useRef<any>(null)
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const [period, setPeriod] = useState<string>(periods[2].text)
  // const [period, setPeriod] = useState<string>(multiplier && multiplier === 31 ? periods[].text : periods[1].text)

  return (
    <Card>
      <CardHeader subheader={player?.id} />
      <Divider />
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            size="small"
            variant="outlined"
            ref={actionRef1}
            onClick={() => setOpenMenuPeriod(true)}
            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
            {period}
          </Button>
          <Box display="flex" alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <DotPrimaryLight />
              {t('Total played')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <DotPrimary />
              {t('Total won')}
            </Typography>
          </Box>
        </Box>
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
                updateDataForPeriod(_period.multiplier)
              }}>
              {_period.text}
            </MenuItem>
          ))}
        </Menu>

        <Box height={250} sx={{ py: 3, px: { lg: 2 } }}>
          <PlayerHistoryStatisticsChartWrapper data={data} labels={labels} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlayerHistoryStatistics
