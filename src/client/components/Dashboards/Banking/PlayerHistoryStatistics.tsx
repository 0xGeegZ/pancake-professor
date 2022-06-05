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

// Group by time period - By 'day' | 'week' | 'month' | 'year'
// ------------------------------------------------------------
const groupByTimePeriod = (obj, timestamp, period) => {
  const objPeriod = {}
  const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
  for (let i = 0; i < obj.length; i++) {
    let d = new Date(obj[i][timestamp] * 1000)
    if (period == 'day') {
      d = Math.floor(d.getTime() / oneDay)
    } else if (period == 'week') {
      d = Math.floor(d.getTime() / (oneDay * 7))
    } else if (period == 'month') {
      d = (d.getFullYear() - 1970) * 12 + d.getMonth()
    } else if (period == 'year') {
      d = d.getFullYear()
    } else {
      console.log('groupByTimePeriod: You have to set a period! day | week | month | year')
    }
    // define object key
    objPeriod[d] = objPeriod[d] || []
    objPeriod[d].push(obj[i])
  }
  return objPeriod
}

function PlayerHistoryStatistics({ player }) {
  const { t }: { t: any } = useTranslation()

  let totalWon = []
  let totalLoss = []
  let totalPlayed = []
  let weekLabels = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun']
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (player?.bets) {
    const groupeds = groupByTimePeriod(player?.bets, 'createdAt', 'day')

    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const timestamp = Math.floor(now.getTime() / oneDay)

    const entries = Object.entries(groupeds).filter((element) => {
      // TODO try different range base on restult count (if no result for 7, try 30, ...)
      return +element[0] >= timestamp - 7
    })
    console.log('🚀 ~ file: PlayerHistoryStatistics.tsx ~ line 82 ~ entries ~ entries', entries)

    totalPlayed = entries
      .map((element) => {
        return element[1]
      })
      .map((element) => {
        const reduced = element.reduce((accu, bet) => {
          // return +accu + +bet.amount
          return +accu + 1
        }, 0)
        return parseFloat(reduced).toFixed(4)
      })
    console.log('🚀 ~ file: PlayerHistoryStatistics.tsx ~ line 94 ~ PlayerHistoryStatistics ~ totalPlayed', totalPlayed)

    totalWon = entries
      .map((element) => {
        return element[1]
      })
      .map((element) => {
        const reduced = element.reduce((accu, bet) => {
          console.log('🚀 ~ file: PlayerHistoryStatistics.tsx ~ line 102 ~ reduced ~ bet', bet)
          // TODO add won amount to total
          // if (bet?.position === bet?.round?.position) return +accu + +bet.amount
          if (bet?.position === bet?.round?.position) return +accu + 1

          return +accu
        }, 0)
        return parseFloat(reduced).toFixed(4)
      })

    totalLoss = entries
      .map((element) => {
        return element[1]
      })
      .map((element) => {
        const reduced = element.reduce((accu, bet) => {
          console.log('🚀 ~ file: PlayerHistoryStatistics.tsx ~ line 102 ~ reduced ~ bet', bet)
          // TODO add won amount to total
          // if (bet?.position === bet?.round?.position) return +accu + +bet.amount
          if (bet?.position !== bet?.round?.position) return +accu + 1

          return +accu
        }, 0)
        return parseFloat(reduced).toFixed(4)
      })

    weekLabels = entries.map(([element]) => {
      const date = new Date(Math.floor(element * oneDay))

      const month = date.getMonth() + 1

      const monthName = date.toLocaleString('default', {
        month: 'long',
      })
      console.log(monthName)
      // TODO use monthName to updat month labels

      const day = date.getDate()

      return `${month}/${day}`
    })
  }

  const data = {
    totalWon,
    totalLoss,
    totalPlayed,
  }

  const generic = {
    weeks: {
      labels: weekLabels,
    },
    month: {
      labels: monthLabels,
    },
  }

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
      value: 'last_week',
      text: t('Last week'),
    },
    {
      value: 'last_month',
      text: t('Last month'),
    },
    {
      value: 'ever',
      text: t('Ever'),
    },
  ]

  const actionRef1 = useRef<any>(null)
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const [period, setPeriod] = useState<string>(periods[2].text)

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
              }}>
              {_period.text}
            </MenuItem>
          ))}
        </Menu>

        <Box height={275} sx={{ py: 3, px: { lg: 2 } }}>
          {/* TODO display loader while totalPlayed is empty */}
          <PlayerHistoryStatisticsChartWrapper data={data} labels={generic.weeks.labels} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default PlayerHistoryStatistics
