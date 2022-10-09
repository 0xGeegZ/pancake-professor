import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Text from 'src/client/components/Text'

import HealthStatusChart from './HealthStatusChart'

const HealthStatusChartWrapper = styled(HealthStatusChart)(
  () => `
    width: 130px;
`
)

const BoxChartWrapperText = styled(Box)(
  ({ theme }) => `
    position: relative;
    width: 130px;
    height: 130px;
    
    .ChartText {
      color: ${theme.colors.warning.main};
      font-weight: bold;
      position: absolute;
      height: 40px;
      width: 40px;
      top: 50%;
      left: 50%;
      margin: -20px 0 0 -20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
`
)

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
)

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
)

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    color: ${theme.colors.alpha.black[70]};
    border-radius: 100px;
    
    :hover {
      background-color: ${theme.colors.alpha.black[10]};
      color: ${theme.colors.alpha.black[100]};
    }
`
)

function HealthStatus() {
  const { t }: { t: any } = useTranslation()

  const data = {
    value: {
      datasets: [
        {
          data: [82, 18],
        },
      ],
      labels: ['', ''],
    },
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader action={<Button>{t('Check status')}</Button>} title={t('Health Status')} />
      <Box sx={{ p: 4 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={4}>
            <BoxChartWrapperText sx={{ mr: 3 }}>
              <div className="ChartText">
                <IconButtonWrapper>
                  <RefreshTwoToneIcon />
                </IconButtonWrapper>
              </div>
              <HealthStatusChartWrapper data={data.value} />
            </BoxChartWrapperText>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="flex-start" flexGrow={1} flexDirection="column">
              <Box sx={{ pb: 2 }}>
                <Typography color="text.primary" variant="h1" sx={{ pr: 0.5, display: 'inline-flex' }}>
                  82
                </Typography>
                <Typography color="text.secondary" variant="h3" sx={{ pr: 2, display: 'inline-flex' }}>
                  /100
                </Typography>
              </Box>
              <List disablePadding sx={{ width: '100%' }}>
                <ListItem disableGutters sx={{ pb: 0 }}>
                  <ListItemText
                    primary={t('High accuracy test run')}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <Box display="flex" alignItems="center">
                    <Text color="success">
                      <b>{t('Ok')}</b>
                    </Text>
                    <AvatarSuccess sx={{ ml: 1 }}>
                      <CheckTwoToneIcon />
                    </AvatarSuccess>
                  </Box>
                </ListItem>
                <ListItem disableGutters sx={{ pb: 0 }}>
                  <ListItemText primary={t('Storage capacity')} primaryTypographyProps={{ variant: 'subtitle2' }} />
                  <Box display="flex" alignItems="center">
                    <Text color="success">
                      <b>{t('Ok')}</b>
                    </Text>
                    <AvatarSuccess sx={{ ml: 1 }}>
                      <CheckTwoToneIcon />
                    </AvatarSuccess>
                  </Box>
                </ListItem>
                <ListItem disableGutters sx={{ pb: 0 }}>
                  <ListItemText primary={t('Performance test')} primaryTypographyProps={{ variant: 'subtitle2' }} />
                  <Box display="flex" alignItems="center">
                    <Text color="error">
                      <b>{t('Failed')}</b>
                    </Text>
                    <AvatarError sx={{ ml: 1 }}>
                      <CloseTwoToneIcon />
                    </AvatarError>
                  </Box>
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default HealthStatus
