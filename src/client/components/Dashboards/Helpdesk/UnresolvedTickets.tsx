import BugReportTwoToneIcon from '@mui/icons-material/BugReportTwoTone'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import HelpdeskChart from './HelpdeskChart'

const IconWrapper = styled('div')(
  ({ theme }) => `
      color:  ${theme.colors.primary.light};
      display: flex;
      align-items: center;
      justify-content: flex-end;
      
      .MuiSvgIcon-fontSizeMedium {
        font-size: ${theme.typography.pxToRem(55)};
      }
`
)
const HelpdeskChartWrapper = styled(HelpdeskChart)(
  () => `
        height: 160px;
`
)

const CardWrapper = styled(Card)(
  () => `
        position: relative;
        min-height: 340px;
        padding: 0;
        overflow: hidden;
`
)

const ChartWrapper = styled('div')(
  ({ theme }) => `
        position: absolute;
        bottom: ${theme.spacing(3)};
        left: -10px;
        right: 0;
        height: 160px;
`
)

const TypographyWrapper = styled(Typography)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(45)};
`
)

const BottomWrapper = styled(Box)(
  ({ theme }) => `
      position: absolute;
      bottom: ${theme.spacing(2)};
      left: 0;
      right: 0;
      padding: 0 ${theme.spacing(3)};
`
)

function UnresolvedTickets() {
  const { t }: { t: any } = useTranslation()

  const tickets = {
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [21, 23, 33, 38, 40, 31, 26, 37, 10, 14, 25, 22],
    },
  }

  return (
    <CardWrapper>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
          <Typography variant="h3" sx={{ width: 80, lineHeight: 1.4 }}>
            {t('Unresolved Tickets')}
          </Typography>
          <IconWrapper>
            <BugReportTwoToneIcon />
          </IconWrapper>
        </Box>
        <Button variant="contained" size="small">
          {t('View tickets')}
        </Button>
      </CardContent>
      <BottomWrapper display="flex" alignItems="center" justifyContent="space-between" sx={{ pt: 2 }}>
        <TypographyWrapper variant="h1">27</TypographyWrapper>
        <Box>
          <Typography align="right" variant="subtitle1" noWrap>
            {t('Previous Period')}
          </Typography>
          <Typography align="right" variant="h3">
            43
          </Typography>
        </Box>
      </BottomWrapper>
      <ChartWrapper>
        <HelpdeskChartWrapper data={tickets.month.data} labels={tickets.month.labels} />
      </ChartWrapper>
    </CardWrapper>
  )
}

export default UnresolvedTickets
