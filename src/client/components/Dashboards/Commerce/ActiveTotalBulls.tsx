import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Label from 'src/client/components/Label'

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

const CardWrapperSuccess = styled(Card)(
  ({ theme }) => `
      border-color: ${theme.palette.success.main};
      border: 1 px solid ${theme.colors.success.main};
`
)

const CardWrapperError = styled(Card)(
  ({ theme }) => `
      border-color: ${theme.colors.success.main};
      border: 1 px solid ${theme.colors.success.main};
`
)

function ActiveTotalBulls({ userBulls, userBears }) {
  const { t }: { t: any } = useTranslation()

  return (
    <Card
      sx={{ px: 1, pt: 1 }}
      // sx={{ px: 1, pt: 1, borderColor: 'error.main' }}
      // color={(userBulls.length * 100) / (userBulls.length + userBears.length) > 50 ? 'success.main' : 'error.main'}
      // style={{ border: '1px solid grey' }}
      // color={(userBulls.length * 100) / (userBulls.length + userBears.length) > 50 ? 'success' : 'error'}
    >
      <CardHeader
        sx={{ pb: 0 }}
        titleTypographyProps={{
          variant: 'subtitle2',
          fontWeight: 'bold',
          color: 'textSecondary',
        }}
        action={
          <Tooltip placement="top" arrow title={t('Total bets on bull for current period.')}>
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={t('Total Bulls Bets')}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="h3">{userBulls.length}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color={(userBulls.length * 100) / (userBulls.length + userBears.length) > 50 ? 'success' : 'error'}>
            {userBulls.length + userBears.length > 0
              ? parseFloat(((userBulls.length * 100) / (userBulls.length + userBears.length)).toString()).toFixed(2)
              : 0}
            %
          </Label>
          {(userBulls.length * 100) / (userBulls.length + userBears.length) > 50 ? (
            <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
          ) : (
            <ArrowDownwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActiveTotalBulls
