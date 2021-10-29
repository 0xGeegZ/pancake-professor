import { FC } from 'react'
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2'
import { alpha, useTheme } from '@mui/material'

interface HelpdeskChartProps {
  data: any[]
  labels: string[]
}

const HelpdeskChart: FC<HelpdeskChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    const primaryGradient = ctx.createLinearGradient(0, 0, 0, 150)

    primaryGradient.addColorStop(0, alpha(theme.colors.alpha.black[30], 0.3))
    primaryGradient.addColorStop(0.5, alpha(theme.colors.alpha.black[30], 0.1))
    primaryGradient.addColorStop(1, alpha(theme.colors.alpha.black[30], 0))

    return {
      datasets: [
        {
          data: dataProp,
          backgroundColor: primaryGradient,
          borderColor: theme.colors.alpha.black[70],
          pointBorderColor: theme.colors.alpha.black[70],
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: theme.colors.alpha.black[70],
          pointHoverBorderColor: theme.palette.common.white,
          pointHoverColor: theme.colors.alpha.black[70],
          pointHoverBorderWidth: 2,
          borderWidth: 2,
          lineTension: 0.01,
          pointBackgroundColor: theme.palette.common.white,
        },
      ],
      labels,
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0,
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
            display: false,
            beginAtZero: true,
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
            beginAtZero: true,
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: 'nearest',
      intersect: false,
      caretSize: 6,
      displayColors: false,
      yPadding: 8,
      xPadding: 16,
      borderWidth: 4,
      borderColor: theme.palette.common.black,
      backgroundColor: theme.palette.common.black,
      titleFontColor: theme.palette.common.white,
      bodyFontColor: theme.palette.common.white,
      footerFontColor: theme.palette.common.white,
      callbacks: {
        title: () => {},
        label: (tooltipItem: any) => `${tooltipItem.xLabel}: ${tooltipItem.yLabel}`,
      },
    },
  }

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  )
}

HelpdeskChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
}

export default HelpdeskChart
