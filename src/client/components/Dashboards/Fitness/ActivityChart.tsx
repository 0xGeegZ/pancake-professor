import { FC } from 'react'
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2'
import { useTheme } from '@mui/material'

interface ActivityChartProps {
  className?: string
  data: any
  labels: string[]
}

const ActivityChart: FC<ActivityChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: [
      {
        label: 'Previous Period',
        backgroundColor: theme.colors.primary.lighter,
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
        borderDash: [10, 5],
        type: 'line',
      },
      {
        label: 'Current Period',
        backgroundColor: 'transparent',
        data: dataProp.current,
        borderColor: theme.palette.error.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.error.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.error.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.error.main,
      },
    ],
    labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cornerRadius: 6,
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
            padding: 12,
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 5,
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
      <Line data={data} options={options} />
    </div>
  )
}

ActivityChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
}

export default ActivityChart
