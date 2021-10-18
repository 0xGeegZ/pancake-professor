import { Grid, Typography, Avatar } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';

function PageHeader() {
  const { t }: { t: any } = useTranslation();
  // const { user } = useAuth();
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(8), height: theme.spacing(8) }}
          variant="rounded"
          alt="Margaret Gale"
          src="/static/images/avatars/1.jpg"
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Welcome')}, Margaret Gale!
        </Typography>
        <Typography variant="subtitle2">
          {t('These are your analytics stats for today')},{' '}
          <b>{format(new Date(), 'MMMM dd yyyy')}</b>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
