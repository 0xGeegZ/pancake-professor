import { Card, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import ConsultationsChart from './ConsultationsChart';
import Label from 'src/client/components/Label';

const ConsultationsChartWrapper = styled(ConsultationsChart)(
  () => `
    width: 100%;
    height: 100%;
    maxWidth: 300px;
`
);

function Consultations() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const consultations = {
    datasets: [
      {
        data: [21, 34],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main
        ],
        hoverBackgroundColor: [
          theme.palette.primary.light,
          theme.palette.success.light,
          theme.palette.warning.light,
          theme.palette.info.light
        ],
        hoverBorderColor: [
          theme.colors.primary.lighter,
          theme.colors.success.lighter,
          theme.colors.warning.lighter,
          theme.colors.info.lighter
        ]
      }
    ],
    labels: [t('Yesterday'), t('Today')]
  };

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ width: '200px', mx: 'auto', height: '200px' }}>
        <ConsultationsChartWrapper data={consultations} />
      </Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{ pt: 2, pb: 1 }}
        justifyContent="center"
      >
        <Typography variant="h3" align="center" sx={{ mr: 1 }}>
          {t('Consultations')}
        </Typography>
        <Label color="success">
          <b>+10%</b>
        </Label>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h1" align="center" sx={{ mr: 1 }}>
          21
        </Typography>
        <Typography variant="subtitle2">{t('Today')}</Typography>
      </Box>
    </Card>
  );
}

export default Consultations;
