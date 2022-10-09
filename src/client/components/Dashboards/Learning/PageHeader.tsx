import ArrowUpwardTwoToneIcon from '@mui/icons-material/ArrowUpwardTwoTone'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import { Avatar, Box, Button, Card, Divider,Grid, Menu, MenuItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { buildStyles } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import Gauge from 'src/client/components/Gauge'

import PageHeaderChart from './PageHeaderChart'

const RootWrapper = styled(Box)(
  ({ theme }) => `
        margin-top: ${theme.spacing(0)};
        background: ${theme.colors.gradients.purple1};
        padding: ${theme.spacing(2)};
        border-radius: ${theme.general.borderRadius};
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          height: ${theme.spacing(38)};
          margin-bottom: ${theme.spacing(12)};
        }
`
)

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.trueWhite[100]};
        color: ${theme.colors.success.main};
        width: ${theme.spacing(3)};
        height: ${theme.spacing(3)};
`
)

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
)

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
)

const TypographyWrapper = styled(Typography)(
  ({ theme }) => `
    @media (min-width: ${theme.breakpoints.values.md}px) {
      max-width: 120px;
    }
      margin: ${theme.spacing(2)} auto 0;
`
)

const GaugeWrapper = styled(Box)(
  ({ theme }) => `
      position: relative;
      width: 140px;
      height: 140px;
      margin-right: ${theme.spacing(3)};

      .MuiAvatar-root,
      .CircularProgressbar {
        position: absolute;
        left: 0;
        top: 0;
      }
      
      .MuiAvatar-root {
        width: 112px;
        height: 112px;
        left: 14px;
        top: 14px;
      }
`
)

const ButtonPeriod = styled(Button)(
  ({ theme }) => `
      border: 0;
        background: ${theme.colors.alpha.trueWhite[10]};
        color: ${theme.colors.alpha.trueWhite[100]};

      .MuiSvgIcon-root {
        color: ${theme.colors.alpha.trueWhite[50]};
      }

      &:hover {
        background: ${theme.colors.alpha.trueWhite[30]};
      }
`
)

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      background: ${theme.colors.alpha.trueWhite[30]};
`
)

const PageHeaderChartWrapper = styled(PageHeaderChart)(
  () => `
        height: 50px;
        width: 120px;
        margin-left: -10px;
`
)

function PageHeader() {
  const { t }: { t: any } = useTranslation()
  // const { user } = useAuth();

  const stats = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    week: [21, 26, 24, 38, 36, 13, 34, 23, 25, 14, 32, 20],
    semester: [38, 16, 28, 20, 13, 22, 35, 26, 24, 33, 27, 32],
  }

  const data = {
    percentage: 44,
    certificates: 4,
    points: 262,
    courses: 8,
    discussions: 42,
  }

  const periods = [
    {
      value: 'this_week',
      text: t('This week'),
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

  const actionRef1 = useRef<any>(null)
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const [period, setPeriod] = useState<string>(periods[0].text)

  return (
    <RootWrapper>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <ButtonPeriod
          variant="contained"
          color="secondary"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
          {period}
        </ButtonPeriod>
        <Menu
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                setPeriod(_period.text)
                setOpenMenuPeriod(false)
              }}>
              {_period.text}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Grid container alignItems="center">
        <Grid item>
          <GaugeWrapper>
            <Gauge
              styles={buildStyles({ rotation: 1 / 2 + 1 / 6 })}
              value={data.percentage}
              strokeWidth={10}
              text=""
              color="trueWhite"
              size="large"
            />
            <Avatar alt="Margaret Gale" src="/static/images/avatars/1.jpg" />
          </GaugeWrapper>
        </Grid>
        <Grid item sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="flex-start">
              <AvatarWrapper sx={{ mr: 1.5, mt: 0.8 }}>
                <ArrowUpwardTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Box>
                <TypographyPrimary variant="h1">{data.points}</TypographyPrimary>
                <TypographySecondary sx={{ pb: 2 }} variant="h3" fontWeight="normal" gutterBottom>
                  {t('learning points earned')}
                </TypographySecondary>
                <TypographyPrimary variant="h3">Margaret Gale, {t('you did a great job last week!')}</TypographyPrimary>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" sx={{ pt: 3 }}>
              <Box>
                <Box display="flex" alignItems="center" sx={{ my: 1 }}>
                  <Box>
                    <TypographyPrimary variant="h4" gutterBottom>
                      3.5h
                    </TypographyPrimary>
                    <TypographySecondary variant="h5" fontWeight="normal">
                      {t('last week')}
                    </TypographySecondary>
                  </Box>
                  <AvatarWrapper sx={{ ml: 3 }}>
                    <ArrowUpwardTwoToneIcon fontSize="small" />
                  </AvatarWrapper>
                </Box>
                <PageHeaderChartWrapper data={stats.week} labels={stats.labels} />
              </Box>
              <DividerWrapper sx={{ m: 3 }} orientation="vertical" flexItem />
              <Box>
                <Box display="flex" alignItems="center" sx={{ my: 1 }}>
                  <Box>
                    <TypographyPrimary variant="h4" gutterBottom>
                      317h
                    </TypographyPrimary>
                    <TypographySecondary variant="h5" fontWeight="normal">
                      {t('all semester')}
                    </TypographySecondary>
                  </Box>
                  <AvatarWrapper sx={{ ml: 3 }}>
                    <ArrowUpwardTwoToneIcon fontSize="small" />
                  </AvatarWrapper>
                </Box>
                <PageHeaderChartWrapper data={stats.semester} labels={stats.labels} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="center" sx={{ mt: 3 }}>
        <Grid xs={12} sm={6} lg={3} item>
          <Card sx={{ p: 3 }}>
            <Typography align="center" variant="h1">
              {data.certificates}
            </Typography>
            <TypographyWrapper align="center" variant="h3" fontWeight="normal" color="text.secondary">
              {t('certificates earned')}
            </TypographyWrapper>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} lg={3} item>
          <Card sx={{ p: 3 }}>
            <Typography align="center" variant="h1">
              {data.points}
            </Typography>
            <TypographyWrapper align="center" variant="h3" fontWeight="normal" color="text.secondary">
              {t('reward points')}
            </TypographyWrapper>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} lg={3} item>
          <Card sx={{ p: 3 }}>
            <Typography align="center" variant="h1">
              {data.courses}
            </Typography>
            <TypographyWrapper align="center" variant="h3" fontWeight="normal" color="text.secondary">
              {t('courses completed')}
            </TypographyWrapper>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} lg={3} item>
          <Card sx={{ p: 3 }}>
            <Typography align="center" variant="h1">
              {data.discussions}
            </Typography>
            <TypographyWrapper align="center" variant="h3" fontWeight="normal" color="text.secondary">
              {t('forum discussions')}
            </TypographyWrapper>
          </Card>
        </Grid>
      </Grid>
    </RootWrapper>
  )
}

export default PageHeader
