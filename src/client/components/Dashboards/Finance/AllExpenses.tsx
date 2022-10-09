import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AllExpensesChart from './AllExpensesChart'

const AllExpensesChartWrapper = styled(AllExpensesChart)(
  () => `
    width: 100%;
    height: 100%;
`
)

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

function AllExpenses() {
  const { t }: { t: any } = useTranslation()
  const actionRef1 = useRef<any>(null)
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false)
  const theme = useTheme()

  const periods = [
    {
      value: 'today',
      text: t('Today'),
    },
    {
      value: 'yesterday',
      text: t('Yesterday'),
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

  const [period, setPeriod] = useState<string>(periods[2].text)

  const data = {
    daily: '$142.21',
    weekly: '$529.83',
    monthly: '$7,153.61',
  }

  const expenses = {
    datasets: [
      {
        data: [20, 10, 25, 30, 15],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.error.main,
        ],
        hoverBackgroundColor: [
          theme.palette.primary.light,
          theme.palette.success.light,
          theme.palette.warning.light,
          theme.palette.info.light,
          theme.palette.error.light,
        ],
        hoverBorderColor: [
          theme.colors.primary.lighter,
          theme.colors.success.lighter,
          theme.colors.warning.lighter,
          theme.colors.info.lighter,
          theme.colors.error.lighter,
        ],
      },
    ],
    labels: [t('Bills'), t('Helath'), t('Education'), t('Entertainment'), t('Others')],
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={
          <Tooltip arrow title={t('View all Expenses')}>
            <IconButton size="small" color="primary">
              <ChevronRightTwoToneIcon />
            </IconButton>
          </Tooltip>
        }
        title={t('All Expenses')}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            px: { lg: 4 },
            pt: 2,
            pb: 4,
            height: '100%',
            flex: 1,
            textAlign: 'center',
          }}>
          <Grid spacing={3} container>
            <Grid item sm={4}>
              <Typography variant="caption" gutterBottom>
                {t('Daily')}
              </Typography>
              <Typography variant="h3" fontWeight="normal">
                {data.daily}
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography variant="caption" gutterBottom>
                {t('Weekly')}
              </Typography>
              <Typography variant="h3" fontWeight="normal">
                {data.weekly}
              </Typography>
            </Grid>
            <Grid item sm={4}>
              <Typography variant="caption" gutterBottom>
                {t('Monthly')}
              </Typography>
              <Typography variant="h3" fontWeight="normal">
                {data.monthly}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Button
          size="small"
          variant="outlined"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
          {period}
        </Button>
        <Menu
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
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

        <Grid pt={3} container spacing={3}>
          <Grid md={6} item display="flex" justifyContent="center" alignItems="center">
            <Box style={{ width: '200px', height: '200px' }}>
              <AllExpensesChartWrapper data={expenses} />
            </Box>
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
              {expenses.labels.map((label: string, i: number) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2,
                  }}>
                  <DotLegend
                    style={{
                      background: `${expenses.datasets[0].backgroundColor[i]}`,
                    }}
                  />
                  <span
                    style={{
                      paddingRight: 6,
                      fontSize: `${theme.typography.pxToRem(11)}`,
                      color: `${expenses.datasets[0].backgroundColor[i]}`,
                    }}>
                    {expenses.datasets[0].data[i]}%
                  </span>
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AllExpenses
