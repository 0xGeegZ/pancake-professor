import { FC } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material';

interface InvestmentsChartProps {
  className?: string;
  data: any;
  labels: string[];
}

const InvestmentsChart: FC<InvestmentsChartProps> = ({
  data: dataProp,
  labels,
  ...rest
}) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        label: 'Previous Period',
        backgroundColor: 'transparent',
        data: dataProp.previous,
        borderColor: theme.palette.warning.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.warning.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.warning.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.warning.main,
        lineTension: 0.1
      },
      {
        label: 'Current Period',
        backgroundColor: 'transparent',
        data: dataProp.current,
        borderColor: theme.palette.info.main,
        pointBorderColor: theme.palette.common.white,
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: theme.palette.info.main,
        pointHoverBorderColor: theme.palette.common.white,
        pointHoverColor: theme.palette.info.main,
        pointHoverBorderWidth: 4,
        pointBackgroundColor: theme.palette.info.main,
        lineTension: 0.1
      }
    ],
    labels
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    legend: {
      display: false
    },
    layout: {
      padding: 0
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      ]
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
      footerFontColor: theme.palette.common.white
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  return (
    <div {...rest}>
      <Line data={data} options={options} />
    </div>
  );
};

InvestmentsChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired
};

export default InvestmentsChart;
