import { FC } from 'react'
import PropTypes from 'prop-types'
import { Bar } from 'react-chartjs-2'
import { useTheme } from '@mui/material'

interface PlayerHistoryStatisticsChartProps {
  className?: string
  data: any
  labels: string[]
}

const PlayerHistoryStatisticsChart: FC<PlayerHistoryStatisticsChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: [
      {
        label: 'Total played',
        backgroundColor: theme.colors.secondary.lighter,
        data: dataProp.totalPlayed,
        barThickness: 12,
        maxBarThickness: 18,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      {
        label: 'Total won',
        backgroundColor: theme.colors.success.main,
        data: dataProp.totalWon,
        barThickness: 12,
        maxBarThickness: 18,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      {
        label: 'Total Loss',
        backgroundColor: theme.colors.error.main,
        data: dataProp.totalLoss,
        barThickness: 12,
        maxBarThickness: 18,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
    ],
    labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cornerRadius: 6,
    animation: false,
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
            maxTicksLimit: 8,
          },
        },
      ],
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
      titleFontSize: 16,
      borderColor: theme.palette.common.black,
      backgroundColor: theme.palette.common.black,
      titleFontColor: theme.palette.common.white,
      bodyFontColor: theme.palette.common.white,
      footerFontColor: theme.palette.common.white,
    },
  }

  return (
    <div {...rest}>
      <Bar data={data} options={options} />
    </div>
  )
}

PlayerHistoryStatisticsChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
}

export default PlayerHistoryStatisticsChart
