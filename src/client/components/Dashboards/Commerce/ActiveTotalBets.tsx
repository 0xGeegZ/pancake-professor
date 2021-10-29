import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import { Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const ArrowUpwardWrapper = styled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
)
function ActiveTotalBets({ userBulls, userBears }) {
  const { t }: { t: any } = useTranslation()

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
          <Tooltip placement="top" arrow title={t('Total bets for current period.')}>
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={t('Total Bets')}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="h3">{userBulls.length + userBears.length}</Typography>
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color="success">+10%</Label>
          <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
        </Box> */}
      </CardContent>
    </Card>
  )
}

export default ActiveTotalBets
