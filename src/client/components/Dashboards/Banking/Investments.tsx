import { useState, ChangeEvent } from 'react'
import { Card, Box, CardContent, CardHeader, Typography, Divider, Avatar, Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Label from 'src/client/components/Label'
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone'
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone'
import InvestmentsChart from './InvestmentsChart'

const AvatarLabelInfo = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.info.lighter};
      color: ${theme.colors.info.main};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
`
)

const AvatarLabelWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color: ${theme.colors.warning.main};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
`
)

function Investments() {
  const { t }: { t: any } = useTranslation()
  const data = {
    amount: '$54,348.55',
    amountIncrease: '$12,475.44',
    amountPercent: '+ 3.24%',
    wallet: '$5,348.73',
    shares: '$785.00',
  }

  const [state, setState] = useState({
    interest: true,
  })

  const interestActivate = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    })
  }

  const referrals = {
    current: [1008, 940, 1010, 821, 1035, 1030, 957, 926, 993, 1021, 997, 879],
    previous: [648, 745, 897, 743, 635, 842, 811, 696, 878, 987, 747, 731],
  }

  const generic = {
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={t('Investments')} />
      <Divider />
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" sx={{ py: 2 }}>
          <Box>
            <Typography variant="h1" sx={{ mb: 1 }}>
              {data.amount}
            </Typography>
            <Box display="flex" alignItems="center">
              <Label color="success">{data.amountIncrease}</Label>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1 }}>
                {data.amountPercent}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">{t('Interest')}</Typography>
            <Switch checked={state.interest} onChange={interestActivate} color="primary" name="interest" />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ py: 3 }}>
          <Box display="flex" alignItems="center" sx={{ mr: 5 }}>
            <AvatarLabelInfo sx={{ mr: 1 }} variant="rounded">
              <AttachMoneyTwoToneIcon />
            </AvatarLabelInfo>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {t('USD Wallet')}
              </Typography>
              <Typography variant="h5">{data.wallet}</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <AvatarLabelWarning sx={{ mr: 1 }} variant="rounded">
              <MonetizationOnTwoToneIcon />
            </AvatarLabelWarning>
            <Box>
              <Typography variant="subtitle2" noWrap>
                {t('Shares')}
              </Typography>
              <Typography variant="h5">{data.shares}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%', flex: 1, pt: 3, px: { lg: 4 } }}>
          <InvestmentsChart data={referrals} labels={generic.month.labels} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default Investments
