import { Typography } from '@mui/material'

import { useTranslation } from 'react-i18next'

function PageHeader() {
  const { t }: { t: any } = useTranslation()
  // const { user } = useAuth();

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        {t('Finance Dashboard')}
      </Typography>
      <Typography variant="subtitle2">
        Margaret Gale, {t('this could be your beautiful finance administration panel.')}
      </Typography>
    </>
  )
}

export default PageHeader
