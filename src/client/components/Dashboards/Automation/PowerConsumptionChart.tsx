import { alpha, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC } from 'react'
import { Line } from 'react-chartjs-2'

interface PowerConsumptionChartProps {
  data: any[]
  labels: string[]
}

const PowerConsumptionChart: FC<PowerConsumptionChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    const primaryGradient = ctx.createLinearGradient(0, 0, 0, 180)

    primaryGradient.addColorStop(0, alpha(theme.colors.warning.main, 0.5))
    primaryGradient.addColorStop(0.5, alpha(theme.colors.warning.main, 0.2))
    primaryGradient.addColorStop(1, alpha(theme.colors.warning.main, 0))

    return {
      datasets: [
        {
          data: dataProp,
          backgroundColor: primaryGradient,
          borderColor: theme.colors.warning.main,
          pointBorderColor: theme.colors.warning.main,
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          pointHoverBackgroundColor: theme.colors.warning.main,
          pointHoverBorderColor: theme.palette.common.white,
          pointHoverColor: theme.colors.warning.main,
          pointHoverBorderWidth: 2,
          borderWidth: 2,
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
      padding: 0,
    },
    scales: {
      xAxes: [
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
            padding: 10,
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
        label: (tooltipItem: any) => `New Users: ${tooltipItem.yLabel}`,
      },
    },
  }

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  )
}

PowerConsumptionChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
}

export default PowerConsumptionChart
