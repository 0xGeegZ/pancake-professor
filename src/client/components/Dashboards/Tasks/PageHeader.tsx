import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';


function PageHeader() {
  const { t }: { t: any } = useTranslation();
  // const { user } = useAuth();

  return (
    <>
      <Typography variant="h2" component="h2" sx={{ pb: 1 }}>
        {t('Hello')}, Margaret Gale!
      </Typography>
      <Typography variant="h4" color="text.secondary" fontWeight="normal">
        {t(
          'Manage your day to day tasks with style! Enjoy a well built UI system.'
        )}
      </Typography>
    </>
  );
}

export default PageHeader;
