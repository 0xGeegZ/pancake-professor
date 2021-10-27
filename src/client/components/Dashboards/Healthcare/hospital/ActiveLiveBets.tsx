import 'moment-timezone';

import { Box, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ActiveLiveBetsChart from './ActiveLiveBetsChart';

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

const DotPrimary = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

const ActiveLiveBetsChartWrapper = styled(ActiveLiveBetsChart)(
  () => `
        height: 220px;
`
)

function ActiveLiveBets({ timeLeft, epoch, userBulls, userBears }) {
  const { t }: { t: any } = useTranslation()
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
      value: 'last_month',
      text: t('Last month'),
    },
    {
      value: 'last_year',
      text: t('Last year'),
    },
  ]

  const [period, setPeriod] = useState<string>(periods[2].text)

  const DEFAULT_STATUS = {
    isDataLoaded: true,
    // isDataLoaded: false,
    data: {
      bulls: [],
      bears: [],
      // current: [1401, 565, 1105, 696, 1469, 1250, 1341, 1231, 505, 783, 998, 738],
      // previous: [1103, 626, 924, 560, 1130, 1081, 971, 1156, 522, 975, 1054, 1421],
    },
    labels: [],
  }

  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const [lastTotal, setLastTotal] = useState<number>(0)
  const [status, setStatus] = useState<any>(DEFAULT_STATUS)
  // status = DEFAULT_STATUS
  // const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    // console.log('userBulls', userBulls.length, 'userBears', userBears.length, 'lastTotal', lastTotal)

    // if (!status) setStatus(DEFAULT_STATUS)
    if (userBulls.length + userBears.length === lastTotal) return
    if (userBulls.length === userBears.length && userBears.length === 0 && userBulls.length === 0) {
      setStatus(DEFAULT_STATUS)
      setLastTotal(0)
      return
    }

    // const _status = status ? status : DEFAULT_STATUS

    status.isDataLoaded = true
    const formatted = `${moment(new Date()).hours()}:${moment(new Date()).minutes()}:${moment(new Date()).seconds()}`

    if (status.labels[status.labels.length - 1] === formatted) {
      status.data.bulls[status.data.bulls.length - 1] = userBulls.length
      status.data.bears[status.data.bears.length - 1] = userBears.length
    } else {
      status.data.bulls.push(userBulls.length)
      status.data.bears.push(userBears.length)
      status.labels.push(formatted)
    }

    // status.labels.push(status.labels.length)

    setStatus(status)
    setLastTotal(userBulls.length + userBears.length)
  }, [userBulls, userBears])

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
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <DotError />
                {t('bears')}
              </Typography>
            </Box>
          </>
          //   <>
          //     <Button
          //       size="small"
          //       variant="outlined"
          //       ref={actionRef1}
          //       onClick={() => setOpenMenuPeriod(true)}
          //       endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
          //       {period}
          //     </Button>
          //     <Menu
          //       anchorEl={actionRef1.current}
          //       onClose={() => setOpenMenuPeriod(false)}
          //       open={openPeriod}
          //       anchorOrigin={{
          //         vertical: 'bottom',
          //         horizontal: 'right',
          //       }}
          //       transformOrigin={{
          //         vertical: 'top',
          //         horizontal: 'right',
          //       }}>
          //       {periods.map((_period) => (
          //         <MenuItem
          //           key={_period.value}
          //           onClick={() => {
          //             setPeriod(_period.text)
          //             setOpenMenuPeriod(false)
          //           }}>
          //           {_period.text}
          //         </MenuItem>
          //       ))}
          //     </Menu>
          //   </>
        }
        // t('Live bet') + (epoch ? t(' for epoch ') + epoch : '') + (timerComponents?.length ? timerComponents : '')
        title={t('Live bet') + (epoch ? t(' for epoch ') + epoch : '')}
      />
      <Divider />
      <CardContent>
        {status?.isDataLoaded ? (
          <Box height={220}>
            <ActiveLiveBetsChartWrapper data={status.data} labels={status.labels} />
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

export default ActiveLiveBets
