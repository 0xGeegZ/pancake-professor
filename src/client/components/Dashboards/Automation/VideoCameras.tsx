import { useRef, useState } from 'react'

import { Box, Typography, MenuItem, Menu, Card, Avatar, Button, IconButton, Tooltip, Grid } from '@mui/material'

import { styled, useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import MicNoneTwoToneIcon from '@mui/icons-material/MicNoneTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import PowerTwoToneIcon from '@mui/icons-material/PowerTwoTone'
import BatteryCharging50TwoToneIcon from '@mui/icons-material/BatteryCharging50TwoTone'
import VideoCamerasChart from './VideoCamerasChart'

const CardCamera = styled(Card)(
  () => `
  position: relative;
      
  & > img {
    width: 100%;
    height: 325px;
    display: block;
    position: relative;
    z-index: 4;
  }
`
)

const CameraActions = styled(Box)(
  ({ theme }) => `
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   z-index: 5;
   padding: ${theme.spacing(3)};
   background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 95%,rgba(0,0,0,0.65) 100%);
`
)

const TalkButton = styled(Button)(
  () => `
  .MuiButton-startIcon {
    margin-right: 0;
    margin-left: -5px;
  }
`
)

const ButtonDark = styled(Button)(
  ({ theme }) => `
  background: rgba(0,0,0,.6);
  color: ${theme.colors.alpha.trueWhite[100]};
  font-size: ${theme.typography.pxToRem(12)};
  font-weight: normal;
  white-space: nowrap;
  height: 32px;
  padding: ${theme.spacing(0, 3)};
  margin: ${theme.spacing(0, 1, 1, 0)};

  &:hover {
    background: rgba(0,0,0,.75);
  }
`
)

const TypographyMain = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.alpha.trueWhite[100]};
`
)

const TypographyShade = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.alpha.trueWhite[70]};
`
)

const Dot = styled(Box)(
  ({ theme }) => `
  background: ${theme.colors.error.main};
  border-radius: 20px;
  width: 6px;
  height: 6px;
`
)

const IconButtonDark = styled(IconButton)(
  ({ theme }) => `
  background: rgba(0,0,0,.6);
  color: ${theme.colors.alpha.trueWhite[100]};
  border-radius: 50px;
  padding: ${theme.spacing(2)};

  &:hover {
    background: rgba(0,0,0,.75);
  }
`
)

const CameraImage = styled('img')(
  ({ theme }) => `
  background: ${theme.colors.alpha.trueWhite[100]};
  padding: ${theme.spacing(0.5)};
  border-radius: ${theme.general.borderRadius};
  height: auto;
  width: 160px;
  display: block;
`
)

const CardWrapper = styled(Card)(
  ({ theme }) => `
  color: ${theme.palette.primary.contrastText};
  padding: 0;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(4, 3, 0)};
  align-items: center;
  justify-content: center;

  .MuiTypography-root {
    color: ${theme.palette.primary.contrastText};
  }
  
  .MuiTypography-h5 {
    color: ${theme.palette.primary.contrastText};
    font-weight: normal;
    padding-bottom: ${theme.spacing(2)};
    font-size: ${theme.typography.pxToRem(14)};
  }

  .MuiTypography-h1 {
    padding: ${theme.spacing(3, 0, 0.8)};
    font-size: ${theme.typography.pxToRem(27)};
  }
`
)

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
`
)

const SparklinesChartWrapper = styled(VideoCamerasChart)(
  () => `
    height: 158px;
    position: relative;
    z-index: 6;
`
)

function VideoCameras() {
  const { t }: { t: any } = useTranslation()

  const locations = [
    {
      value: 'garden_camera',
      text: t('Garden camera'),
    },
    {
      value: 'gate_camera',
      text: t('Gate camera'),
    },
    {
      value: 'terrace_camera',
      text: t('Terrace camera'),
    },
  ]

  const [location, setLocation] = useState<string>(locations[0].text)
  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)
  const theme = useTheme()

  const camera = {
    usage: {
      data: [74, 34, 78, 72, 88],
    },
    battery: {
      data: [63, 82, 28, 39, 38],
    },
  }

  const generic = {
    month: {
      labels: ['January', 'February', 'March', 'April', 'May'],
    },
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={12}>
          <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Typography variant="h3">{location}</Typography>
            </Box>
            <Button
              endIcon={<UnfoldMoreTwoToneIcon />}
              ref={actionRef}
              onClick={() => setOpenMenuLocation(true)}
              variant="contained">
              {t('Select camera')}
            </Button>
            <Menu
              anchorEl={actionRef.current}
              onClose={() => setOpenMenuLocation(false)}
              open={openLocation}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}>
              {locations.map((_location) => (
                <MenuItem
                  key={_location.value}
                  onClick={() => {
                    setLocation(_location.text)
                    setOpenMenuLocation(false)
                  }}>
                  {_location.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <CardCamera>
            <CameraActions display="flex" flexDirection="column" justifyContent="space-between">
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <ButtonDark startIcon={<Dot />} size="small">
                    {t('LIVE')}
                  </ButtonDark>
                  <ButtonDark size="small">
                    {t('Effects')}: {t('On')}
                  </ButtonDark>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  sx={{ maxWidth: 170 }}>
                  <TypographyMain gutterBottom fontWeight="bold" textAlign="center">
                    2249 Armory Road
                  </TypographyMain>
                  <TypographyShade sx={{ mb: 2 }} textAlign="center">
                    Mike Dwyer is ringing the doorbell
                  </TypographyShade>
                  <Tooltip arrow placement="top" title={t('Unlock front door')}>
                    <IconButtonDark>
                      <LockOpenTwoToneIcon />
                    </IconButtonDark>
                  </Tooltip>
                </Box>
              </Box>
              <Box
                sx={{ width: '100%' }}
                display="flex"
                alignSelf="flex-end"
                alignItems="flex-end"
                justifyContent="space-between">
                <Box>
                  <TalkButton variant="contained" size="small" color="warning" startIcon={<MicNoneTwoToneIcon />}>
                    {t('Talk')}
                  </TalkButton>
                </Box>
                <Box>
                  <CameraImage src="/static/images/placeholders/fitness/3.jpg" />
                </Box>
              </Box>
            </CameraActions>
            <img src="/static/images/placeholders/covers/garden_camera.jpg" alt="..." />
          </CardCamera>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={6}>
          <CardWrapper sx={{ mt: { md: 7, lg: 0 }, background: theme.colors.gradients.orange1 }}>
            <AvatarWrapper>
              <PowerTwoToneIcon fontSize="large" />
            </AvatarWrapper>
            <Typography variant="h1">
              45 <small>min</small>
            </Typography>
            <Typography textAlign="center" variant="h5">
              {t('Last charged to 100%')}
            </Typography>

            <Box sx={{ height: 142, margin: '0 0 0 -10px' }}>
              <SparklinesChartWrapper data={camera.usage.data} labels={generic.month.labels} />
            </Box>
          </CardWrapper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={6}>
          <CardWrapper sx={{ mt: { md: 7, lg: 0 }, background: theme.colors.gradients.purple1 }}>
            <AvatarWrapper>
              <BatteryCharging50TwoToneIcon fontSize="large" />
            </AvatarWrapper>
            <Typography variant="h1">
              82 <small>%</small>
            </Typography>
            <Typography textAlign="center" variant="h5">
              {t('Remaining battery')}
            </Typography>

            <Box sx={{ height: 142, margin: '0 0 0 -10px' }}>
              <SparklinesChartWrapper data={camera.battery.data} labels={generic.month.labels} />
            </Box>
          </CardWrapper>
        </Grid>
      </Grid>
    </>
  )
}

export default VideoCameras
