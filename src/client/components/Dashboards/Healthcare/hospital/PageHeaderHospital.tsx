import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone'
import { Box, Button,Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Link from 'src/client/components/Link'

function PageHeader() {
  const { t }: { t: any } = useTranslation()

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Hospital Administration')}
        </Typography>
        <Typography variant="subtitle2">{t('This is your hospital’s overview status page.')}</Typography>
      </Box>
      <Box>
        <Button
          component={Link}
          href="/dashboards/healthcare/doctor"
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardTwoToneIcon fontSize="small" />}>
          {t('Switch to Doctor Overview')}
        </Button>
      </Box>
    </Box>
  )
}

export default PageHeader
