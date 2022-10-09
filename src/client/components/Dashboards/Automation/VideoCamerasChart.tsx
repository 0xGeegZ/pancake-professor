import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC } from 'react'
import { Line } from 'react-chartjs-2'

interface VideoCamerasChartProps {
  data: any[]
  labels: string[]
}

const VideoCamerasChart: FC<VideoCamerasChartProps> = ({ data: dataProp, labels, ...rest }) => {
  const theme = useTheme()

  const data = () => ({
    datasets: [
      {
        data: dataProp,
        borderWidth: 1,
        backgroundColor: theme.colors.alpha.trueWhite[30],
        borderColor: theme.colors.alpha.trueWhite[70],
        borderCapStyle: 'round',
        pointBorderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
    labels,
  })

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
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
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
            min: 0,
            maxTicksLimit: 5,
          },
        },
      ],
    },
    tooltips: {
      enabled: false,
    },
  }

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  )
}

VideoCamerasChart.propTypes = {
  data: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
}

export default VideoCamerasChart
