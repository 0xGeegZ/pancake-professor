import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { FC, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

interface PlayerStatsDayAverageChartProps {
  className?: string
  data: any
  labels: string[]
}

const PlayerStatsDayAverageChart: FC<PlayerStatsDayAverageChartProps> = ({ data: dataProp, labels, ...rest }) => {
  // console.log('🚀 ~ labels length', labels?.length)
  // console.log('🚀 ~ dataProp?.current length', dataProp?.current ? dataProp?.current.length : 0)
  // console.log('🚀 ~ dataProp?.previous length', dataProp?.previous ? dataProp?.previous.length : 0)
  const theme = useTheme()

  // const data = {
  const DEFAULT_DATA = {
    datasets: [
      {
        label: 'Bulls',
        backgroundColor: 'transparent',
        data: null,
        // data: dataProp.current,
        // data:
        //   dataProp.current.length > 50
        //     ? dataProp.current.slice(dataProp.current.length - 51, dataProp.current.length - 1)
        //     : dataProp.current,
        borderColor: theme.palette.success.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.success.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.success.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.success.main,
        type: 'line',
        lineTension: 0.01,
      },
      {
        label: 'Bears',
        backgroundColor: 'transparent',
        data: null,
        // data: dataProp.previous,
        // data:
        //   dataProp.previous.length > 50
        //     ? dataProp.previous.slice(dataProp.previous.length - 51, dataProp.previous.length - 1)
        //     : dataProp.previous,
        borderColor: theme.colors.error.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        lineTension: 0.01,

        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.colors.error.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.colors.error.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.colors.error.main,
      },
    ],
    labels,
    // labels: labels.length > 10 ? labels.slice(labels.length - 11, labels.length - 1) : labels,
  }

  const options = {
    responsive: true,
    animation: false,
    // animation: {
    //   duration: 250 * 1.5,
    //   easing: 'linear',
    // },
    maintainAspectRatio: false,
    cornerRadius: 6,
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: 0,
        right: 10,
        top: 0,
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
            beginAtZero: false,
            min: 0,
            // maxTicksLimit: dataProp.previous.length + dataProp.current.length,
            // maxTicksLimit:
            //   dataProp.previous.length > dataProp.current.length ? dataProp.previous.length + 2 : dataProp.current.length + 2,
            maxTicksLimit: 10,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            borderDash: [6],
            borderDashOffset: [0],
            color: theme.colors.alpha.black[10],
            drawBorder: false,
            zeroLineBorderDash: [6],
            zeroLineBorderDashOffset: [0],
            zeroLineColor: theme.colors.alpha.black[10],
          },
          ticks: {
            display: false,
            beginAtZero: false,
            min: 0,
            maxTicksLimit: 10,
            // maxTicksLimit: dataProp.previous.length + dataProp.current.length,
            // maxTicksLimit:
            //   dataProp.previous.length > dataProp.current.length ? dataProp.previous.length + 2 : dataProp.current.length + 2,
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

  const [data, setData] = useState<any>(DEFAULT_DATA)
  const [lastTotal, setLastTotal] = useState<number>(0)

  useEffect(() => {
    console.log('PlayerStatsDayAverageChart > useEffect')
    // if (!dataProp) return

    // if (!data) setData(DEFAULT_DATA)

    // const _data = data ? data : DEFAULT_DATA

    // if (dataProp.current.length === dataProp.previous.length && dataProp.previous.length === 0 && dataProp.current.length === 0) {
    //   console.log('ActiveLiveBets > DEFAULT_STATUS')
    //   setData(DEFAULT_DATA)
    //   setLastTotal(0)
    //   // router.replace(router.asPath)
    //   return
    // }

    // if (dataProp.current.length + dataProp.previous.length === lastTotal) return
    const ldata = data
    ldata.datasets[0].data = dataProp.current
    ldata.datasets[1].data = dataProp.previous
    ldata.labels = labels

    setData(ldata)
    setLastTotal(dataProp.current.length + dataProp.previous.length)
    // }, [dataProp, labels, DEFAULT_DATA])
  }, [dataProp, labels, data, lastTotal])

  return (
    <div {...rest}>
      <Line data={data} options={options} redraw />
    </div>
  )
}

PlayerStatsDayAverageChart.propTypes = {
  // data: PropTypes.object,
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
  // labels: PropTypes.array,
}

export default PlayerStatsDayAverageChart
