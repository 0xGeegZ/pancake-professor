import { Card, CardContent, CardHeader, Typography, Grid, Divider, useTheme, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'

import SalesCategoryChart from './SalesCategoryChart'

const SalesCategoryChartWrapper = styled(SalesCategoryChart)(
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

function SalesByCategory() {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const sales = {
    datasets: [
      {
        data: [20, 10, 40, 30],
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
    labels: [t('Electronics'), t('Furniture'), t('Fashion'), t('Home & Decor')],
  }

  return (
    <Card>
      <CardHeader title={t('Sales by Category')} />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid md={6} item display="flex" justifyContent="center" alignItems="center">
            <Box style={{ width: '200px', height: '200px' }}>
              <SalesCategoryChartWrapper data={sales} />
            </Box>
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
              {sales.labels.map((label: string, i: number) => (
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
                      background: `${sales.datasets[0].backgroundColor[i]}`,
                    }}
                  />
                  <span
                    style={{
                      paddingRight: 6,
                      fontSize: `${theme.typography.pxToRem(11)}`,
                      color: `${sales.datasets[0].backgroundColor[i]}`,
                    }}>
                    {sales.datasets[0].data[i]}%
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

export default SalesByCategory
