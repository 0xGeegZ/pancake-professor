import { Grid, Typography, Avatar } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import LiveHelpTwoToneIcon from '@mui/icons-material/LiveHelpTwoTone';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.main};
      color: ${theme.palette.getContrastText(theme.colors.primary.main)};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.primary};
      margin-right: ${theme.spacing(2)};
`
);

function PageHeader() {
  const { t }: { t: any } = useTranslation();
  // const { user } = useAuth();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <AvatarPrimary sx={{ mb: { xs: 2, sm: 0 } }} variant="rounded">
          <LiveHelpTwoToneIcon fontSize="large" />
        </AvatarPrimary>
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Helpdesk')}
        </Typography>
        <Typography variant="subtitle2">
          Margaret Gale, {t('this is your helpdesk dashboard overview for today')}
          , <b>{format(new Date(), 'MMMM dd yyyy')}</b>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
