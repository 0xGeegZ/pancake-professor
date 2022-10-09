import 'moment-timezone'

import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PlayerStatsDayAverageChart from './PlayerStatsDayAverageChart'

const DotSuccess = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.success.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)
const DotError = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.error.main};
    width: ${theme.spacing(1.1)};
    height: ${theme.spacing(1.1)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

// const DotPrimary = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     background: ${theme.colors.primary.main};
//     width: ${theme.spacing(1.5)};
//     height: ${theme.spacing(1.5)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// )

const PlayerStatsDayAverageChartWrapper = styled(PlayerStatsDayAverageChart)(
  () => `
        height: 220px;
`
)

// function PlayerStatsDayAverage({ timeLeft, epoch, userBulls, userBears }) {
function PlayerStatsDayAverage({ player }) {
  const { t }: { t: any } = useTranslation()
  // const router = useRouter()

  const actionRef1 = useRef<any>(null)

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

  const DEFAULT_STATUS = useMemo(() => {
    return {
      isDataLoaded: true,
      // isDataLoaded: false,
      data: {
        bets: [],
        current: [1401, 565, 1105, 696, 1469, 1250, 1341, 1231, 505, 783, 998, 738],
        previous: [1103, 626, 924, 560, 1130, 1081, 971, 1156, 522, 975, 1054, 1421],
      },
      labels: [],
    }
  }, [])
  const [period, setPeriod] = useState<string>(periods[2].text)

  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)

  const [status, setStatus] = useState<any>(DEFAULT_STATUS)
  // status = DEFAULT_STATUS
  // const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    console.log('PlayerStatsDayAverage > useEffect')

    // if (!status) setStatus(DEFAULT_STATUS)

    // if (userBulls.length === userBears.length && userBears.length === 0 && userBulls.length === 0) {
    //   console.log('PlayerStatsDayAverage > DEFAULT_STATUS')

    //   // status.data = {}
    //   status.data.bets = []
    //   status.isDataLoaded = false
    //   setStatus(DEFAULT_STATUS)
    //   setLastTotal(0)
    //   // router.replace(router.asPath)
    //   return
    // }

    // const _status = status ? status : DEFAULT_STATUS

    status.isDataLoaded = true
    const formatted = `${moment(new Date()).hours()}:${moment(new Date()).minutes()}:${moment(new Date()).seconds()}`

    status.data.bets.push(player?.bets)
    status.labels.push(formatted)

    setStatus(status)
  }, [status, player, DEFAULT_STATUS])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={
          <>
            <Box pt={1} display="flex" alignItems="center" justifyContent="flex-end">
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <DotSuccess />
                {t('bulls')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                <DotError />
                {t('bears')}
              </Typography>
              <Button
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
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
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
            </Box>
          </>
        }
        title={t('') + player?.id}
      />
      <Divider />
      <CardContent>
        {status?.isDataLoaded ? (
          <Box height={220}>
            <PlayerStatsDayAverageChartWrapper data={status.data} labels={status.labels} />
          </Box>
        ) : (
          <Box height={200}>
            <Grid sx={{ py: 10 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item>
                <CircularProgress color="secondary" size="1rem" />
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default PlayerStatsDayAverage
