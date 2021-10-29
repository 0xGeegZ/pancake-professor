import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Label from 'src/client/components/Label'

const ArrowDownwardWrapper = styled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
)
function ActiveUsers() {
  const { t }: { t: any } = useTranslation()

  const data = {
    value: '347',
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
          <Tooltip placement="top" arrow title={t('Active users for selected range')}>
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={t('Active Users')}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant="h3">{data.value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label color="error">-5.2%</Label>
          <ArrowDownwardWrapper sx={{ ml: 0.5, mr: -0.2 }} fontSize="small" />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActiveUsers
