import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Label from 'src/client/components/Label'

// const DotError = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     background: ${theme.colors.error.main};
//     width: ${theme.spacing(1.1)};
//     height: ${theme.spacing(1.1)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// )

const ArrowDownwardWrapper = styled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
)

const ArrowUpwardWrapper = styled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
)

function ActiveTotalBears({ userBulls, userBears }) {
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
          <Tooltip placement="top" arrow title={t('Total bets on bear for current period.')}>
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={t('Total Bears Bets')}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="h3">{userBears.length}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color={(userBears.length * 100) / (userBulls.length + userBears.length) > 50 ? 'success' : 'error'}>
            {userBulls.length + userBears.length > 0
              ? parseFloat(((userBears.length * 100) / (userBulls.length + userBears.length)).toString()).toFixed(2)
              : 0}
            %
          </Label>
          {(userBears.length * 100) / (userBulls.length + userBears.length) > 50 ? (
            <ArrowUpwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
          ) : (
            <ArrowDownwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActiveTotalBears
