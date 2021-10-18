import { Card, CardHeader, Typography, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import ParametersChart from './ParametersChart';

function HeartRate() {
  const { t }: { t: any } = useTranslation();

  const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
`
  );

  const ParametersChartWrapper = styled(ParametersChart)(
    () => `
        height: 80px;
`
  );

  const parameter = {
    weeks: [
      'Monday',
      'Tueday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    data: [171, 73, 129, 141, 70, 147, 130]
  };

  return (
    <Card sx={{ p: 1 }}>
      <CardHeader
        avatar={
          <AvatarSuccess>
            <FavoriteTwoToneIcon />
          </AvatarSuccess>
        }
        title={t('Heart Rate')}
        titleTypographyProps={{ variant: 'h5' }}
        action={
          <>
            <Typography align="right" variant="h3">
              65
            </Typography>
            <Typography
              align="right"
              variant="subtitle1"
              color="text.secondary"
            >
              {t('bpm')}
            </Typography>
          </>
        }
      />
      <ParametersChartWrapper data={parameter.data} labels={parameter.weeks} />
    </Card>
  );
}

export default HeartRate;
