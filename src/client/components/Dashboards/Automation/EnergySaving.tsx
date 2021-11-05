import { Box, Typography, Tooltip, Card, CardHeader, IconButton } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone'
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone'
import EnergySavingChart from './EnergySavingChart'

const CardWrapper = styled(Card)(
  ({ theme }) => `
  overflow: visible;
  background: ${theme.colors.gradients.blue1};
  color: ${theme.palette.primary.contrastText};
  padding: ${theme.spacing(3, 3, 2.4)};
  margin-top: ${theme.spacing(0.8)};

  .MuiTypography-root {
    color: ${theme.palette.primary.contrastText};
  }

  .MuiTypography-h1 {
    font-size: ${theme.typography.pxToRem(40)};
  }
`
)

const EnergyBox = styled(Box)(
  () => `
    height: 66px;
    width: 47%;
    position: relative;

    img {
      position: absolute;
      width: 140px;
      height: 140px;
      left: 50%;
      top: 50%;
      margin: -130px 0 0 -70px;
      z-index: 5;
    }
`
)

const SparklinesChartWrapper = styled(EnergySavingChart)(
  () => `
    height: 75px;
    position: relative;
    z-index: 6;
`
)

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    color: ${theme.palette.primary.contrastText};
`
)

function EnergySaving() {
  const { t }: { t: any } = useTranslation()

  const energy = {
    month: {
      data: [5, 12, 44, 1, 9, 7, 45, 12, 45, 21, 4, 2],
    },
  }

  const generic = {
    month: {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
  }

  return (
    <>
      <Box mb={1} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">{t('Energy')}</Typography>
        <Tooltip placement="top" title={t('Add new scene')} arrow>
          <IconButton size="large" color="primary">
            <KeyboardArrowRightTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <CardWrapper>
        <CardHeader
          sx={{ p: 0 }}
          titleTypographyProps={{
            variant: 'h5',
            fontWeight: 'normal',
          }}
          action={
            <Tooltip placement="top" arrow title={t('Add a description here, if needed')}>
              <IconButtonWrapper size="small" color="primary">
                <MoreHorizTwoToneIcon />
              </IconButtonWrapper>
            </Tooltip>
          }
          title={t('2021 Energy Status')}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Typography noWrap variant="h1">
            87.4 <small>kW h</small>
          </Typography>
          <EnergyBox>
            <SparklinesChartWrapper data={energy.month.data} labels={generic.month.labels} />
            <img src="/static/images/placeholders/illustrations/pressure-high.svg" alt="Partly cloudy" />
          </EnergyBox>
        </Box>
      </CardWrapper>
    </>
  )
}

export default EnergySaving
