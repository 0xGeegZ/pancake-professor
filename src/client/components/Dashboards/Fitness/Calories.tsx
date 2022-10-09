import FastfoodTwoToneIcon from '@mui/icons-material/FastfoodTwoTone'
import { Avatar, Box, Card, LinearProgress,Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
      border-radius: ${theme.general.borderRadius};
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
      margin-bottom: ${theme.spacing(3)};
`
)

function Steps() {
  const { t }: { t: any } = useTranslation()

  return (
    <Card sx={{ p: 3 }}>
      <AvatarWrapperError>
        <FastfoodTwoToneIcon />
      </AvatarWrapperError>
      <Typography variant="h3" sx={{ pb: 1 }}>
        {t('Calories')}
      </Typography>
      <Typography color="text.primary" variant="h2" sx={{ pr: 0.5, display: 'inline-flex' }}>
        76%
      </Typography>
      <Box pt={3}>
        <LinearProgress value={76} color="primary" variant="determinate" />
      </Box>
    </Card>
  )
}

export default Steps
