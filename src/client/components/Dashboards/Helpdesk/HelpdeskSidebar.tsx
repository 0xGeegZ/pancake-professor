import { Avatar, Box, Divider, LinearProgress, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Text from 'src/client/components/Text'

import HelpdeskSidebarChart from './HelpdeskSidebarChart'

const HelpdeskSidebarChartWrapper = styled(HelpdeskSidebarChart)(
  () => `
    width: 160px;
`
)

const BoxChartWrapperText = styled(Box)(
  ({ theme }) => `
    position: relative;
    width: 160px;
    height: 160px;
    
    .ChartText {
      color: ${theme.colors.alpha.black[100]};
      font-weight: bold;
      position: absolute;
      height: 100px;
      width: 100px;
      font-size: ${theme.typography.pxToRem(23)};
      top: 50%;
      left: 50%;
      margin: -50px 0 0 -50px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
`
)

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
      flex-grow: 1;
      height: 10px;
      
      &.MuiLinearProgress-root {
        background-color: ${theme.colors.alpha.black[10]};
      }
      
      .MuiLinearProgress-bar {
        border-radius: ${theme.general.borderRadiusXl};
      }
`
)

const AvatarUnhappy = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
      font-size: ${theme.typography.pxToRem(26)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      border: 3px solid ${theme.colors.error.main};
      color: ${theme.colors.error.main};
      margin-right: ${theme.spacing(2)};
`
)
const AvatarOk = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
      font-size: ${theme.typography.pxToRem(26)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      border: 3px solid ${theme.colors.warning.main};
      color: ${theme.colors.warning.main};
      margin-right: ${theme.spacing(2)};
`
)
const AvatarHappy = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.white[100]};
      font-size: ${theme.typography.pxToRem(26)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      border: 3px solid ${theme.colors.success.main};
      color: ${theme.colors.success.main};
      margin-right: ${theme.spacing(2)};
`
)

function HelpdeskSidebar() {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const data = {
    datasets: [
      {
        data: [21, 34, 34],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
        ],
        hoverBackgroundColor: [
          theme.palette.primary.light,
          theme.palette.success.light,
          theme.palette.warning.light,
          theme.palette.info.light,
        ],
        hoverBorderColor: [
          theme.colors.primary.lighter,
          theme.colors.success.lighter,
          theme.colors.warning.lighter,
          theme.colors.info.lighter,
        ],
      },
    ],
    labels: [t('Bad'), t('Ok'), t('Great')],
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t('Customer Satisfaction')}
      </Typography>
      <Typography variant="subtitle2">{t('See how satisfied are customers with this helpdesk')}</Typography>

      <BoxChartWrapperText sx={{ my: 3 }}>
        <div className="ChartText">
          <span>89%</span>
          <Typography variant="subtitle1">{t('very satisfied')}</Typography>
        </div>
        <HelpdeskSidebarChartWrapper data={data} />
      </BoxChartWrapperText>

      <Box display="flex" alignItems="center" sx={{ my: 1 }}>
        <AvatarUnhappy variant="rounded">🙁</AvatarUnhappy>
        <Box>
          <Typography variant="h5">
            <Text color="error">{t('Bad, bad, bad')}</Text>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <b>5</b> {t('customers are unhappy')}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" sx={{ my: 1 }}>
        <AvatarOk variant="rounded">😐</AvatarOk>
        <Box>
          <Typography variant="h5">
            <Text color="warning">{t("Meh, it's ok!")}</Text>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <b>232</b> {t('customers could use some improvements')}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" sx={{ my: 1 }}>
        <AvatarHappy variant="rounded">😀</AvatarHappy>
        <Box>
          <Typography variant="h5">
            <Text color="success">{t('Everything is super!')}</Text>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        {t('Tickets by Channel')}
      </Typography>

      <Box py={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('Website')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (23)
            </Typography>
          </Typography>
          <Typography variant="h5">20%</Typography>
        </Box>
        <LinearProgressWrapper value={20} color="primary" variant="determinate" />
      </Box>
      <Box py={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('Email')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (23)
            </Typography>
          </Typography>
          <Typography variant="h5">65%</Typography>
        </Box>
        <LinearProgressWrapper value={65} color="primary" variant="determinate" />
      </Box>
      <Box pt={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('Social Accounts')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (23)
            </Typography>
          </Typography>
          <Typography variant="h5">15%</Typography>
        </Box>
        <LinearProgressWrapper value={15} color="primary" variant="determinate" />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        {t('Tickets by Topics')}
      </Typography>

      <Box py={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('Shipment')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (15)
            </Typography>
          </Typography>
          <Typography variant="h5">20%</Typography>
        </Box>
        <LinearProgressWrapper value={20} color="primary" variant="determinate" />
      </Box>
      <Box py={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('Troubleshooting')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (12)
            </Typography>
          </Typography>
          <Typography variant="h5">52%</Typography>
        </Box>
        <LinearProgressWrapper value={52} color="primary" variant="determinate" />
      </Box>
      <Box pt={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            {t('eCommerce Issues')}{' '}
            <Typography variant="subtitle1" color="text.secondary" component="span">
              (66)
            </Typography>
          </Typography>
          <Typography variant="h5">28%</Typography>
        </Box>
        <LinearProgressWrapper value={28} color="primary" variant="determinate" />
      </Box>
    </Box>
  )
}

export default HelpdeskSidebar
