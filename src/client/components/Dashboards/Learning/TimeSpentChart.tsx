import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC } from 'react'
import { Bar } from 'react-chartjs-2'

interface TimeSpentChartProps {
  className?: string
  data: any
  labels: string[]
}

const TimeSpentChart: FC<TimeSpentChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: [
      {
        label: 'Previous Period',
        backgroundColor: 'transparent',
        data: dataProp.previous,
        borderColor: theme.palette.success.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        borderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.success.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.success.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.success.main,
        borderDash: [15, 5],
        type: 'line',
      },
      {
        label: 'Current Period',
        backgroundColor: theme.colors.secondary.main,
        data: dataProp.current,
        barThickness: 34,
        maxBarThickness: 40,
        barPercentage: 0.3,
        categoryPercentage: 0.3,
      },
    ],
    labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cornerRadius: 55,
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: theme.spacing(15),
        right: theme.spacing(15),
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            padding: 18,
            fontColor: theme.palette.text.secondary,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            borderDash: [6],
            borderDashOffset: [0],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [6],
            zeroLineBorderDashOffset: [0],
            zeroLineColor: theme.palette.divider,
          },
          ticks: {
            display: false,
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 10,
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: 'nearest',
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

TimeSpentChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
}

export default TimeSpentChart
