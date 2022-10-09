import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC } from 'react'
import { Pie } from 'react-chartjs-2'

interface ChartProps {
  data: any
}

const ExpensesChart: FC<ChartProps> = ({ data: dataProp, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: dataProp.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 10,
      borderColor: theme.palette.common.white,
      hoverBorderColor: theme.palette.common.white,
      hoverBorderWidth: 12,
      rotation: 90,
    })),
    labels: dataProp.labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 60,
    legend: {
      display: false,
    },
    layout: {
      padding: 0,
    },
    tooltips: {
      enabled: true,
      caretSize: 6,
      displayColors: false,
      mode: 'label',
      intersect: true,
      yPadding: 8,
      xPadding: 16,
      borderWidth: 4,
      bodySpacing: 10,
      borderColor: theme.palette.common.black,
      backgroundColor: theme.palette.common.black,
      titleFontColor: theme.palette.common.white,
      bodyFontColor: theme.palette.common.white,
      footerFontColor: theme.palette.common.white,
      callbacks: {
        label(tooltipItem, _data) {
          const label = _data.labels[tooltipItem.index]
          const value = _data.datasets[0].data[tooltipItem.index]

          return `${label}: ${value}%`
        },
      },
    },
  }

  return <Pie data={data} options={options} {...rest} />
}

ExpensesChart.propTypes = {
  data: PropTypes.object.isRequired,
}

export default ExpensesChart
