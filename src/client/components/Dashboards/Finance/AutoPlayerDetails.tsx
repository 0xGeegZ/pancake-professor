import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { alpha, Box, Button, Card, CardContent, CardHeader, Hidden, IconButton, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
      background-color: ${theme.colors.secondary.lighter};
      color:  ${theme.colors.primary.main};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      border-radius: 100px;
      
      &:hover {
          background-color: ${alpha(theme.colors.secondary.light, 0.3)};
      }
`
)

function UpgradeAccount() {
  const { t }: { t: any } = useTranslation()

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
      }}>
      <Box>
        <CardHeader
          title={t('Let our algorythmes play for you')}
          titleTypographyProps={{
            variant: 'h2',
            gutterBottom: true,
            noWrap: true,
            color: 'textPrimary',
          }}
          subheader={t('It constantly analyse best players and follow thooses wo are currently play there best game.')}
          subheaderTypographyProps={{
            variant: 'subtitle2',
            gutterBottom: true,
            sx: { pt: 1 },
            noWrap: true,
          }}
        />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="h4" fontWeight="normal" sx={{ pb: 3 }} color="text.primary" component="p">
            {t('Be part of the first beta testors!')}
          </Typography>
          <Button disabled variant="outlined" color="secondary">
            {t('Join waiting list')}
          </Button>
        </CardContent>
      </Box>
      <Hidden mdDown>
        <img src="/static/images/placeholders/illustrations/5.svg" alt="..." />
      </Hidden>
      <Hidden smDown>
        <IconButtonWrapper>
          <Link href="/app" underline="hover">
            <ChevronRightIcon fontSize="large" />
          </Link>
        </IconButtonWrapper>
      </Hidden>
    </Card>
  )
}

export default UpgradeAccount
