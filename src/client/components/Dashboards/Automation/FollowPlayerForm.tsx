import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import AvTimerTwoToneIcon from '@mui/icons-material/AvTimerTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import LoopTwoToneIcon from '@mui/icons-material/LoopTwoTone'
import RemoveTwoToneIcon from '@mui/icons-material/RemoveTwoTone'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Collapse,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { useSnackbar } from 'notistack'
import { forwardRef, ReactElement, Ref, useState } from 'react'
import { buildStyles } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import Gauge from 'src/client/components/Gauge'
import { useCreateStrategieMutation } from 'src/client/graphql/createStrategie.generated'

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
)

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[10]};
    color: ${theme.colors.alpha.black[100]};
    padding: ${theme.spacing(2, 5)};
    border-radius: ${theme.general.borderRadiusXl};
`
)

const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
      padding: ${theme.spacing(3)};

      .MuiTouchRipple-root {
        opacity: .3;
      }

      .MuiCardActionArea-focusHighlight {
        background: ${theme.colors.primary.lighter};
      }

      &:hover {
        .MuiCardActionArea-focusHighlight {
          opacity: 0.05;
        }
      }
`
)

const GaugeWrapper = styled(Box)(
  () => `
    position: relative;
`
)

const BoxButtons = styled(Box)(
  () => `
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 20px;
    display: flex;
    justify-content: center;
`
)

const BoxDegrees = styled(Box)(
  () => `
    position: absolute;
    width: 208px;
    bottom: 10px;
    display: flex;
    justify-content: space-between;
    z-index: 4;

    sup {
      margin: 2px 0 0 -3px;
    }
`
)

const IconButtonIncrement = styled(IconButton)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
      color: ${theme.colors.alpha.black[70]};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
      border-radius: 50px;
      box-shadow: 0px 1px 3px ${theme.colors.alpha.black[30]}, 0px 3px 8px 1px ${theme.colors.alpha.black[10]};
      display: flex;
      align-items: center;
      margin: 0 15px;
      justify-content: center;
      transition: ${theme.transitions.create(['all'])};
      z-index: 5;

      &:hover {
        background-color: ${theme.colors.primary.main};
        color: ${theme.palette.primary.contrastText};
        box-shadow: ${theme.colors.shadows.primary};
      }
`
)

// function MUISwitch(props: UseSwitchProps) {
//   const { getInputProps, checked, disabled, focusVisible } = useSwitch(props)

//   const stateClasses = {
//     checked,
//     disabled,
//     focusVisible,
//   }

//   return (
//     <SwitchRoot className={clsx(stateClasses)}>
//       <SwitchTrack>
//         <SwitchThumb className={clsx(stateClasses)} />
//       </SwitchTrack>
//       <SwitchInput {...getInputProps()} aria-label="Demo switch" />
//     </SwitchRoot>
//   )
// }

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

// function FollowPlayerForm({ handleCloseCreateForm, player }) {
function FollowPlayerForm({}) {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const [gauge, setGauge] = useState(20)

  const [openDialog, setOpenDialog] = useState(false)

  const [openAlert, setOpenAlert] = useState(true)

  const [, createStrategie] = useCreateStrategieMutation()

  const { enqueueSnackbar } = useSnackbar()

  const handleGaugeIncrease = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setGauge((g) => g + 2)
  }

  const handleGaugeDecrease = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setGauge((g) => g - 2)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const sumbitCreateStrategie = async () => {
    const { error } = await createStrategie({
      //   player: $player
      // amount: $amount
      // isActive: $isActive
      // isDeleted: $isDeleted
      // maxLooseAmount: $maxLooseAmount
      // minWinAmount: $minWinAmount
    })

    if (error) {
      enqueueSnackbar(t('TUnexpected error during strategie creation'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      return
    }

    enqueueSnackbar(t('Stratégie successfully created and is waiting for launch.'), {
      variant: 'success',
      TransitionComponent: Zoom,
    })

    handleCloseDialog()
    // handleCloseCreateForm()
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box display="flex" justifyContent="space-between" p={4} mb={2} alignItems="center">
              <Box display="flex" alignItems="center">
                {/* <AvatarPrimary>
                  <AcUnitTwoToneIcon fontSize="medium" />
                </AvatarPrimary> */}
                <Box pl={1}>
                  <Typography gutterBottom variant="h4">
                    {t('Bankroll')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="normal">
                    {t('Set bankroll amount to follow player')}
                  </Typography>
                </Box>
              </Box>
              {/* <MUISwitch defaultChecked /> */}
            </Box>
            <GaugeWrapper display="flex" justifyContent="center" flexDirection="column">
              <Gauge
                circleRatio={0.65}
                styles={buildStyles({ rotation: 1 / 2 + 1 / 5.7 })}
                value={gauge}
                strokeWidth={10}
                text=""
                color="primary"
                size="xxlarge">
                <Box sx={{ mt: '-30px', textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: `${theme.typography.pxToRem(12)}`, fontWeight: 'bold' }}
                    variant="caption"
                    color="text.secondary">
                    Bankroll amount
                  </Typography>
                  <Typography sx={{ mt: '-8px', fontSize: `${theme.typography.pxToRem(40)}`, pt: 1 }} variant="h1">
                    {gauge}%
                  </Typography>
                </Box>
              </Gauge>
              <BoxButtons>
                <IconButtonIncrement onClick={handleGaugeDecrease}>
                  <RemoveTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
                <IconButtonIncrement onClick={handleGaugeIncrease}>
                  <AddTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
                <BoxDegrees>
                  <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                    0%
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                    100%
                  </Typography>
                </BoxDegrees>
              </BoxButtons>
            </GaugeWrapper>
            <Stack
              mt={3}
              spacing={3}
              alignItems="center"
              direction="row"
              justifyContent="center"
              divider={<Divider orientation="vertical" flexItem />}>
              <AvatarWrapper>
                <AvTimerTwoToneIcon fontSize="medium" />
              </AvatarWrapper>
              <AvatarWrapper>
                <LoopTwoToneIcon fontSize="medium" />
              </AvatarWrapper>
            </Stack>
            <Stack
              mt={1}
              mb={4}
              spacing={3}
              direction="row"
              alignItems="center"
              justifyContent="center"
              divider={<Divider sx={{ background: 'transparent' }} orientation="vertical" flexItem />}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5">Stop if loose</Typography>
                <Typography variant="subtitle2" textAlign="center" noWrap>
                  30%
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5">Stop when won</Typography>
                <Typography variant="subtitle2" textAlign="center" noWrap>
                  50%
                </Typography>
              </Box>
            </Stack>

            <Grid item xs={12}>
              <CardActionAreaWrapper>
                {/* <Button size="small" fullWidth variant="contained"> */}
                <Button size="small" fullWidth variant="contained" onClick={handleOpenDialog}>
                  <b> {t('Copy')}</b>
                </Button>
              </CardActionAreaWrapper>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}>
        <Box sx={{ px: 4, pb: 4, pt: 4 }}>
          <Collapse in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false)
                  }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="warning">
              {t('This product is in beta, use it at your own risk.')}
            </Alert>
          </Collapse>

          <Typography align="center" sx={{ py: 4, pt: 5, pb: 5, pl: 10, pr: 10 }} variant="h3">
            {t('Are you sur to copy this player ? ')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 0, pr: 5, pl: 5 }} variant="body1">
            {t('We are listenning the adress directly from mempool to be as precise as possible.')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 5, pr: 5, pl: 5 }} variant="body1">
            {t(
              'Most of the time, you will play on the same block, but sometime, it could play on the next block and could be beatted for you but works for player.'
            )}
          </Typography>

          <Button fullWidth size="large" variant="contained" onClick={sumbitCreateStrategie}>
            {t('Copy player')}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  )
}

FollowPlayerForm.propTypes = {
  // player: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.string,
  //   })
  // ).isRequired,
  // handleCloseCreateForm: PropTypes.func.isRequired,
}

export default FollowPlayerForm
