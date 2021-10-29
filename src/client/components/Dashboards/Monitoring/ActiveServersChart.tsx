import { FC } from 'react'
import PropTypes from 'prop-types'
import { Bar } from 'react-chartjs-2'
import { useTheme } from '@mui/material'

interface ActiveServersChartProps {
  className?: string
  data: any
  labels: string[]
}

const ActiveServersChart: FC<ActiveServersChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: [
      {
        label: 'Previous Period',
        backgroundColor: 'transparent',
        data: dataProp.previous,
        borderColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.primary.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.primary.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.primary.main,
        borderDash: [5, 10],
        type: 'line',
      },
      {
        label: 'Current Period',
        backgroundColor: theme.palette.warning.main,
        data: dataProp.current,
        barThickness: 18,
        maxBarThickness: 20,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
    labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cornerRadius: 66,
    legend: {
      display: false,
    },
    layout: {
      padding: 0,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,

            fontColor: theme.palette.text.secondary,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
            padding: 12,
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 4,
            maxTicksLimit: 8,
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      caretSize: 6,
      displayColors: true,
      yPadding: 8,
      xPadding: 16,
      borderWidth: 4,
      bodySpacing: 10,
      titleFontSize: 16,
      borderColor: theme.palette.common.black,
      backgroundColor: theme.palette.common.black,
      titleFontColor: theme.palette.common.white,
      bodyFontColor: theme.palette.common.white,
      footerFontColor: theme.palette.common.white,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  }

  return (
    <div {...rest}>
      <Bar data={data} options={options} />
    </div>
  )
}

ActiveServersChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
}

export default ActiveServersChart
