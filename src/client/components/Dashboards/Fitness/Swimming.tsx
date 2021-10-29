import { Card, CardHeader, Typography, Avatar } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import PoolTwoToneIcon from '@mui/icons-material/PoolTwoTone'
import ParametersChart from './ParametersChart'

function Swimming() {
  const { t }: { t: any } = useTranslation()

  const AvatarInfo = styled(Avatar)(
    ({ theme }) => `
      background-color: ${theme.colors.info.lighter};
      color: ${theme.colors.info.main};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
`
  )

  const ParametersChartWrapper = styled(ParametersChart)(
    () => `
        height: 80px;
`
  )

  const parameter = {
    weeks: ['Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    data: [22, 15, 19, 7, 13, 1, 18],
  }

  return (
    <Card sx={{ p: 1 }}>
      <CardHeader
        avatar={
          <AvatarInfo>
            <PoolTwoToneIcon />
          </AvatarInfo>
        }
        title={t('Swimming')}
        titleTypographyProps={{ variant: 'h5' }}
        action={
          <>
            <Typography align="right" variant="h3">
              12
            </Typography>
            <Typography align="right" variant="subtitle1" color="text.secondary">
              {t('miles')}
            </Typography>
          </>
        }
      />
      <ParametersChartWrapper data={parameter.data} labels={parameter.weeks} />
    </Card>
  )
}

export default Swimming
