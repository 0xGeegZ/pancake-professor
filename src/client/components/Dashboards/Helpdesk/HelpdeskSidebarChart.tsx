import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC } from 'react'
import { Doughnut } from 'react-chartjs-2'

interface ChartProps {
  data: any
}

const HelpdeskSidebarChart: FC<ChartProps> = ({ data: dataProp, ...rest }) => {
  const theme = useTheme()

  const data = {
    datasets: dataProp.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 0,
      hoverBorderWidth: 0,
      backgroundColor: [theme.colors.warning.main, theme.colors.success.main, theme.colors.error.main],
      hoverBackgroundColor: [theme.colors.warning.light, theme.colors.success.light, theme.colors.error.light],
    })),
    labels: dataProp.labels,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 75,
    legend: {
      display: false,
    },
    layout: {
      padding: 0,
    },
    tooltips: {
      enabled: false,
    },
  }

  return <Doughnut data={data} options={options} {...rest} />
}

HelpdeskSidebarChart.propTypes = {
  data: PropTypes.object.isRequired,
}

export default HelpdeskSidebarChart
