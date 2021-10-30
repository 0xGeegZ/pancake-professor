/* eslint-disable react/prop-types */
import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import { Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const ArrowDownwardWrapper = styled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
)
const ActiveTotalAmount = ({ userBulls, userBears }) => {
  const { t }: { t: any } = useTranslation()

  const getAmount = (users) => {
    if (!users.length) return 0

    return users
      .map((u) => +u.amount)
      .reduce((acc, num) => acc + num, 0)
      .toFixed(2)
  }
  return (
    <Card sx={{ px: 1, pt: 1 }}>
      <CardHeader
        sx={{ pb: 0 }}
        titleTypographyProps={{
          variant: 'subtitle2',
          fontWeight: 'bold',
          color: 'textSecondary',
        }}
        action={
          <Tooltip placement="top" arrow title={t('Total bets amount for current period.')}>
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={t('Amount Total')}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="h3">{getAmount([...userBulls, ...userBears])} BNB</Typography>
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color="error">-5.2%</Label>
          <ArrowDownwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small"></ArrowDownwardWrapper>
        </Box> */}
      </CardContent>
    </Card>
  )
}

export default ActiveTotalAmount
