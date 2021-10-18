import {
  Card,
  CardHeader,
  Grid,
  Divider,
  Alert,
  List,
  ListItem,
  Box,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Label from 'src/client/components/Label';
import Text from 'src/client/components/Text';

import deFlag from 'country-flag-icons/3x2/DE.svg';
import usFlag from 'country-flag-icons/3x2/US.svg';
import esFlag from 'country-flag-icons/3x2/ES.svg';
import frFlag from 'country-flag-icons/3x2/FR.svg';
import ActiveServersChart from './ActiveServersChart';

const ImageWrapper = styled('img')(
  ({ theme }) => `
        width: 46px;
        margin-right: ${theme.spacing(2)};
`
);

const ActiveServersChartWrapper = styled(ActiveServersChart)(
  () => `
        height: 200px;      
`
);

const ListItemWrapper = styled(ListItem)(
  ({ theme }) => `
        border-radius: 0;
        padding: ${theme.spacing(2)};
`
);

function ActiveServers() {
  const { t }: { t: any } = useTranslation();

  const referrals = {
    current: [1008, 940, 1010, 821, 1035, 1030, 957, 926, 993, 1021, 997, 879],
    previous: [648, 745, 897, 743, 635, 842, 811, 696, 878, 987, 747, 731]
  };

  const generic = {
    month: {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    }
  };

  return (
    <Card>
      <CardHeader title={t('Active Servers')} />
      <Divider />
      <Grid container>
        <Grid item xs={12} md>
          <List disablePadding component="div">
            <ListItemWrapper>
              <ListItemAvatar
                sx={{
                  minWidth: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ImageWrapper alt="Germany" src={deFlag} />
              </ListItemAvatar>
              <ListItemText
                primary="Frankfurt"
                primaryTypographyProps={{ variant: 'h5' }}
                secondary="material-ui.com"
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Label color="success">{t('active')}</Label>
                <Typography
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ pt: 0.5 }}
                >
                  {t('Page Load')}:{' '}
                  <Text color="black">
                    <b>36ms</b>
                  </Text>
                </Typography>
              </Box>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
              <ListItemAvatar
                sx={{
                  minWidth: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ImageWrapper alt="USA" src={usFlag} />
              </ListItemAvatar>
              <ListItemText
                primary="San Francisco"
                primaryTypographyProps={{ variant: 'h5' }}
                secondary="google.com"
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Label color="warning">{t('provisioning')}</Label>
                <Typography
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ pt: 0.5 }}
                >
                  {t('Page Load')}:{' '}
                  <Text color="black">
                    <b>255ms</b>
                  </Text>
                </Typography>
              </Box>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
              <ListItemAvatar
                sx={{
                  minWidth: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ImageWrapper alt="Spain" src={esFlag} />
              </ListItemAvatar>
              <ListItemText
                primary="Barcelona"
                primaryTypographyProps={{ variant: 'h5' }}
                secondary="example.xyz"
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Label color="error">{t('high risk')}</Label>
                <Typography
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ pt: 0.5 }}
                >
                  {t('Page Load')}:{' '}
                  <Text color="black">
                    <b>387ms</b>
                  </Text>
                </Typography>
              </Box>
            </ListItemWrapper>
            <Divider />
            <ListItemWrapper>
              <ListItemAvatar
                sx={{
                  minWidth: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ImageWrapper alt="USA" src={frFlag} />
              </ListItemAvatar>
              <ListItemText
                primary="Toulouse"
                primaryTypographyProps={{ variant: 'h5' }}
                secondary="city.example"
                secondaryTypographyProps={{ variant: 'subtitle1' }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Label color="error">{t('high risk')}</Label>
                <Typography
                  align="right"
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ pt: 0.5 }}
                >
                  {t('Page Load')}:{' '}
                  <Text color="black">
                    <b>456ms</b>
                  </Text>
                </Typography>
              </Box>
            </ListItemWrapper>
          </List>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={12} md>
          <Box
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Alert severity="warning">
              {t('Too many servers have problems starting!')}
            </Alert>

            <ActiveServersChartWrapper
              data={referrals}
              labels={generic.month.labels}
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ActiveServers;
