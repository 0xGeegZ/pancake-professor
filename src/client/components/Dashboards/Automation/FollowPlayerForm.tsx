import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import RemoveTwoToneIcon from '@mui/icons-material/RemoveTwoTone'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Slide,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import { forwardRef, ReactElement, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateStrategieMutation } from 'src/client/graphql/createStrategie.generated'

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
)

// const GaugeWrapper = styled(Box)(
//   () => `
//     position: relative;
// `
// )

// const BoxButtons = styled(Box)(
//   () => `
//     position: absolute;
//     width: 100%;
//     left: 0;
//     bottom: 20px;
//     display: flex;
//     justify-content: center;
// `
// )

const BoxSliderButtons = styled(Box)(
  () => `
    display: flex;
    justify-content: center;
`
)

// const BoxDegrees = styled(Box)(
//   () => `
//     position: absolute;
//     width: 208px;
//     bottom: 10px;
//     display: flex;
//     justify-content: space-between;
//     z-index: 4;

//     sup {
//       margin: 2px 0 0 -3px;
//     }
// `
// )

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

const SliderWrapper = styled(Slider)(({ theme }) => ({
  color: theme.colors.primary.main,
  height: 10,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: theme.colors.alpha.trueWhite,
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: theme.colors.primary.main,
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}))

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

function FollowPlayerForm({ user, handleCloseCreateForm, player }) {
  // function FollowPlayerForm() {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const [pending, setPending] = useState(false)

  const [gauge, setGauge] = useState(50)

  const [openDialog, setOpenDialog] = useState(false)

  const [openAlert, setOpenAlert] = useState(true)

  const [, createStrategie] = useCreateStrategieMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [stopLoss, setStopLoss] = useState(30)
  const handleChangeStopLoss = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStopLoss(+event.target.value)
  }

  const [takeProfit, setTakeProfit] = useState(150)
  const handleChangeTakeProfit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTakeProfit(+event.target.value)
  }

  const handleGaugeIncrease = (e: { preventDefault: () => void }, newValue: number | null) => {
    e.preventDefault()
    if (gauge === 100) return
    // setGauge((g) => g + (gauge >= 80 || gauge <= 20 ? 1 : 2))
    setGauge((g) => newValue || g + 1)
  }
  const handleGaugeIncreaseEvent = (e: { preventDefault: () => void }) => {
    handleGaugeIncrease(e, null)
  }

  const handleGaugeDecrease = (e: { preventDefault: () => void }, newValue: number | null) => {
    e.preventDefault()
    if (gauge === 0) return

    // setGauge((g) => g - (gauge >= 80 || gauge <= 20 ? 1 : 2))
    setGauge((g) => newValue || g - 1)
  }
  const handleGaugeDecreaseEvent = (e: { preventDefault: () => void }) => {
    handleGaugeDecrease(e, null)
  }

  const handleChange = (_event: Event, newValue: number) => {
    if (newValue > gauge) handleGaugeIncrease(_event, newValue)
    else handleGaugeDecrease(_event, newValue)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setPending(false)
  }

  // const getAvailableBankroll = () => {
  //   let balance = user.generatedBalance

  //   if (user.strategies.length) {
  //     const usedBankroll = user.strategies
  //       .filter((s) => s.isActive)
  //       .map((s) => s.currentAmount)
  //       .reduce((acc, num) => acc + num, 0)
  //     // const usedBankroll = user.strategies.map((s) => s.startedAmount).reduce((acc, num) => acc + num, 0)

  //     // console.log('🚀 ~ file: FollowPlayerForm.tsx ~ line 139 ~ sumbitCreateStrategie ~ usedBankroll', usedBankroll)
  //     balance -= usedBankroll
  //   }
  //   const amount = +((+gauge * balance) / 100).toFixed(4)

  //   return amount > 0 ? amount : 0
  // }

  const sumbitCreateStrategie = async () => {
    console.log(
      '🚀 ~ sumbitCreateStrategie',
      // player,
      // 'user',
      // user,
      'gauge',
      gauge,
      'stopLoss',
      stopLoss,
      'takeProfit',
      takeProfit
    )

    // const amount = getAvailableBankroll()
    const amount = +((+gauge * user.generatedBalance) / 100).toFixed(4)

    if (amount < 0.0001) {
      enqueueSnackbar(t('Amount is too small. Please check you balance.'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      return
    }

    if (amount / 13 < 0.0001) {
      enqueueSnackbar(t('Amount is less than minimum bet.'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      return
    }

    if (+takeProfit <= 110) {
      enqueueSnackbar(t('Take Profit need to be greather than 110%.'), {
        variant: 'error',
      })
      return
    }

    if (+stopLoss < 10) {
      enqueueSnackbar(t('Stop Loss need to be greather or equal to 10%.'), {
        variant: 'error',
      })
      return
    }

    setPending(true)

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!provider) return

    // const rawBalance = await provider.getBalance(user.generated)

    // const balance = ethers.utils.formatUnits(rawBalance)
    // console.log('🚀 ~ file: AddFundsForm.tsx ~ line 213 ~ sumbitAddFunds ~ balance', balance)

    // console.log('🚀 ~ file: AddFundsForm.tsx ~ line 225 ~ sumbitAddFunds ~ amount', amount)

    const rawGasPrice = await provider.getGasPrice()
    const gasPrice = ethers.utils.formatUnits(rawGasPrice)

    // let bnbValue = amount
    let bnbValue = `${amount}`

    const gasLimit = await provider.estimateGas({
      to: user.generated,
      value: ethers.utils.parseEther(bnbValue),
    })

    if (gauge === 100) {
      // TODO GUIGUI ERROR
      const costs = +gasPrice * +gasLimit
      bnbValue = `${+user.generatedBalance - +costs}`
    }

    const maxLooseAmount = +((stopLoss * amount) / 100).toFixed(4)
    const minWinAmount = +((takeProfit * amount) / 100).toFixed(4)

    const { error } = await createStrategie({
      player: player.id,
      startedAmount: +bnbValue,
      maxLooseAmount,
      minWinAmount,
    })

    if (error) {
      enqueueSnackbar(t('Unexpected error during strategie creation'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    } else {
      enqueueSnackbar(t('Stratégie successfully created and is waiting for launch.'), {
        variant: 'success',
        TransitionComponent: Zoom,
      })
    }

    handleCloseDialog()
    handleCloseCreateForm()
  }

  const getBnbForOneBet = () => {
    return +((+gauge * user.generatedBalance) / 100 / 13).toFixed(4)
  }

  const getFeesRatioForOneBet = () => {
    // TODO calculate fees with provider
    const fees = 0.000558792
    const oneBetAmount = getBnbForOneBet()
    return +((fees * 100) / oneBetAmount).toFixed(2)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box display="flex" justifyContent="space-between" sx={{ pt: 4, pl: 4, pr: 4, pb: 2 }} alignItems="center">
              <Box display="flex" alignItems="center">
                <Box pl={1}>
                  <Typography gutterBottom variant="h4">
                    {t('Bankroll')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="normal">
                    {t('Set bankroll amount to follow player')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* <GaugeWrapper display="flex" justifyContent="center" flexDirection="column">
              <Gauge
                circleRatio={0.65}
                styles={buildStyles({ rotation: 1 / 2 + 1 / 5.7 })}
                value={gauge}
                strokeWidth={10}
                text=""
                color={gauge >= 70 ? 'error' : gauge >= 50 ? 'warning' : gauge <= 10 ? 'warning' : 'primary'}
                size="xxlarge">
                <Box sx={{ mt: '-30px', textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: `${theme.typography.pxToRem(12)}`, fontWeight: 'bold' }}
                    variant="caption"
                    color="text.secondary">
                    Bankroll amount
                  </Typography>
                  <Typography sx={{ mt: '-6px', fontSize: `${theme.typography.pxToRem(18)}`, pt: 1 }} variant="h1">
                    {((+gauge * user.generatedBalance) / 100).toFixed(4)} BNB <sup>({gauge}%) </sup>
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
            </GaugeWrapper> */}
            <Box sx={{ textAlign: 'center' }} pb={2} px={3}>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography
                  sx={{ fontSize: `${theme.typography.pxToRem(12)}`, fontWeight: 'bold' }}
                  variant="caption"
                  color="text.secondary">
                  Bankroll amount
                </Typography>
                <Typography sx={{ mt: '-6px', fontSize: `${theme.typography.pxToRem(18)}`, pt: 1 }} variant="h1">
                  {((+gauge * user.generatedBalance) / 100).toFixed(4)} BNB <sup>({gauge}%) </sup>
                </Typography>
              </Box>
              <SliderWrapper
                aria-label="Amount"
                defaultValue={30}
                value={gauge}
                valueLabelDisplay="off"
                step={5}
                // marks
                min={0}
                max={100}
                onChange={handleChange}
              />
              <BoxSliderButtons>
                <IconButtonIncrement onClick={handleGaugeDecreaseEvent}>
                  <RemoveTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
                <IconButtonIncrement onClick={handleGaugeIncreaseEvent}>
                  <AddTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
              </BoxSliderButtons>
            </Box>
            <Box sx={{ textAlign: 'center' }} pb={2} px={3}>
              <Grid spacing={1} container>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontSize: `${theme.typography.pxToRem(10)}` }}
                    variant="h6"
                    color={getBnbForOneBet() <= 0.001 ? 'error' : getBnbForOneBet() <= 0.005 ? 'warning' : ''}>
                    {t(`You'll bet ${getBnbForOneBet()} BNB for each game (${+(100 / 13).toFixed(1)}%).`)}
                  </Typography>
                  <Typography
                    sx={{ fontSize: `${theme.typography.pxToRem(10)}` }}
                    variant="h6"
                    color={getFeesRatioForOneBet() >= 25 ? 'error' : getFeesRatioForOneBet() >= 10.0 ? 'warning' : ''}>
                    {t(`Transaction costs will be approximatly ${getFeesRatioForOneBet()}% of your bet amount.`)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Stack
              spacing={2}
              alignItems="center"
              direction="row"
              justifyContent="center"
              divider={<Divider orientation="vertical" flexItem />}>
              <Box sx={{ textAlign: 'center' }} pl={3} py={1}>
                <Grid container display="flex" alignItems="center">
                  <Grid item xs={10}>
                    <TextField
                      id="outlined-number"
                      label="Stop Loss"
                      type="number"
                      size="small"
                      onChange={handleChangeStopLoss}
                      value={stopLoss}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} pl={0.3}>
                    <Tooltip
                      placement="bottom-end"
                      title={`${t('Stop if strategie loose more than ') + stopLoss}% of started bankroll`}
                      arrow>
                      <IconButton color="secondary" size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ textAlign: 'center' }} pr={3} py={1}>
                <Grid container display="flex" alignItems="center">
                  <Grid item xs={10}>
                    <TextField
                      id="outlined-number"
                      label="Take Profit"
                      type="number"
                      size="small"
                      onChange={handleChangeTakeProfit}
                      value={takeProfit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Tooltip
                      placement="bottom-end"
                      title={`${t('Stop if strategie won more than ') + takeProfit}% of started bankroll`}
                      arrow>
                      <IconButton color="secondary" size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            </Stack>

            <Box px={3} py={2}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  {/* <Button
                    size="small"
                    fullWidth
                    variant="contained"
                    disabled={getAvailableBankroll() === 0}
                    onClick={handleOpenDialog}>
                    <b> {t('Copy')}</b>
                  </Button> */}
                  {+user.generatedBalance === 0 ? (
                    // {getAvailableBankroll() === 0 ? (
                    <Tooltip
                      placement="top"
                      title={t('Need to have available BNB in secondary address to copy player')}
                      arrow>
                      <Button size="small" fullWidth variant="outlined" color="warning">
                        <b> {t('Copy')}</b>
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button size="small" fullWidth variant="contained" onClick={handleOpenDialog}>
                      <b> {t('Copy')}</b>
                    </Button>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Button size="small" fullWidth variant="outlined" color="secondary" onClick={handleCloseCreateForm}>
                    <b> {t('Close')}</b>
                    <CloseIcon fontSize="inherit" />
                  </Button>
                </Grid>
              </Grid>
            </Box>
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
            {t('Are you sure to copy this player ? ')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 0, pr: 5, pl: 5 }} variant="body1">
            {t('We are listenning the adress directly from mempool to be as precise as possible.')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 5, pr: 5, pl: 5 }} variant="body1">
            {t(
              'Most of the time, you will play on the same block, but sometime, it could play on the next block and could be beatted for you but works for player.'
            )}
          </Typography>

          {/* <Button fullWidth size="large" variant="contained" onClick={sumbitCreateStrategie}>
            {t('Copy player')}
          </Button> */}
          <LoadingButton
            fullWidth
            onClick={sumbitCreateStrategie}
            loading={pending}
            variant="contained"
            color="primary">
            {t('Copy player')}
          </LoadingButton>
        </Box>
      </DialogWrapper>
    </>
  )
}

export default FollowPlayerForm
