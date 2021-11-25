import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import RemoveTwoToneIcon from '@mui/icons-material/RemoveTwoTone'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Slider,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { ethers } from 'ethers'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { forwardRef, ReactElement, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRemoveFundsMutation } from 'src/client/graphql/removeFunds.generated'

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

const BoxButtons = styled(Box)(
  () => `
    display: flex;
    justify-content: center;
`
)

// const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {
//   const { value } = props

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ width: '100%', mr: 0 }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
//       </Box>
//     </Box>
//   )
// }

// const LinearProgressWrapper = styled(LinearProgressWithLabel)(
//   ({ theme }) => `
//     flex-grow: 1;
//     margin-right: ${theme.spacing(3)};
//     margin-left: ${theme.spacing(3)};
//     height: 15px;

//     .MuiLinearProgress-barColorPrimary {
//       background-color: ${theme.colors.primary.main};
//       border-top-right-radius: ${theme.general.borderRadius};
//       border-bottom-right-radius: ${theme.general.borderRadius};
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

function RemoveFundsForm({ user, handleCloseForm }) {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  const [pending, setPending] = useState(false)

  const [gauge, setGauge] = useState(20)
  const [bnbValue, setBnbValue] = useState((user.generatedBalance * 20) / 100)

  const [openDialog, setOpenDialog] = useState(false)

  const [openAlert, setOpenAlert] = useState(true)

  const [, removeFunds] = useRemoveFundsMutation()

  const { enqueueSnackbar } = useSnackbar()

  const handleGaugeIncrease = (e: { preventDefault: () => void }, newValue: number | null) => {
    e.preventDefault()
    if (gauge === 100) return

    // const updated = newValue || gauge + (gauge >= 80 || gauge <= 20 ? 1 : 2)
    const updated = newValue || gauge + 1
    setGauge(updated)
    setBnbValue((user.generatedBalance * updated) / 100)
  }
  const handleGaugeIncreaseEvent = (e: { preventDefault: () => void }) => {
    handleGaugeIncrease(e, null)
  }

  const handleGaugeDecrease = (e: { preventDefault: () => void }, newValue: number | null) => {
    e.preventDefault()
    if (gauge === 0) return

    // const updated = newValue || gauge - (gauge >= 80 || gauge <= 20 ? 1 : 2)
    const updated = newValue || gauge - 1
    setGauge(updated)
    setBnbValue((user.generatedBalance * updated) / 100)
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

  const sumbitRemoveFunds = async () => {
    if (!window.ethereum?.request) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    if (!provider) return

    if (+bnbValue === 0) return

    setPending(true)
    try {
      const { error } = await removeFunds({ id: user.id, value: bnbValue.toString() })
      console.log('🚀 ~ file: RemoveFundsForm.tsx ~ line 212 ~ sumbitRemoveFunds ~ error', error)

      if (error) {
        enqueueSnackbar(t('Unexpected error during transaction. Please contact an administrator.'), {
          variant: 'error',
          TransitionComponent: Zoom,
        })
      } else {
        enqueueSnackbar(t('Funds succefully sended.'), {
          variant: 'success',
          TransitionComponent: Zoom,
        })
      }
    } catch (error) {
      enqueueSnackbar(t('Unexpected error during transaction. Please verify your MetaMask account and retry.'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }

    handleCloseDialog()
    handleCloseForm()

    // OLD VERSION
    // make this on server side to hide private key
    // const privateKey = decrypt(user.private)

    // const wallet = new ethers.Wallet(privateKey)

    // const signer = wallet.connect(provider)

    // const gasPrice = await provider.getGasPrice()

    // const gasLimit = await provider.estimateGas({
    //   to: user.generated,
    //   value: ethers.utils.parseEther(bnbValue),
    // })

    // const costs = +gasPrice * +gasLimit
    // const value = `${+bnbValue - +costs}`

    // const tx = {
    //   to: user.address,
    //   // value: ethers.utils.parseEther(bnbValue),
    //   value: ethers.utils.parseEther(value),
    //   nonce: provider.getTransactionCount(user.generated, 'latest'),
    //   gasPrice,
    //   gasLimit: ethers.utils.hexlify(gasLimit),
    // }

    // try {
    //   await signer.sendTransaction(tx)

    //   enqueueSnackbar(t('Funds succefully sended.'), {
    //     variant: 'success',
    //     TransitionComponent: Zoom,
    //   })
    // } catch (error) {
    //   enqueueSnackbar(t('Unexpected error during transaction. Please verify your MetaMask account and retry.'), {
    //     variant: 'error',
    //     TransitionComponent: Zoom,
    //   })
    // }

    // handleCloseDialog()
    // handleCloseForm()
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box display="flex" justifyContent="space-between" sx={{ pt: 4, px: 4, pb: 0, mb: 0 }} alignItems="center">
              <Box display="flex" alignItems="center">
                <Box pl={1}>
                  <Typography gutterBottom variant="h4">
                    {t('Remove Funds')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="normal">
                    {t('Remove funds from your secondary address')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box px={3} py={2}>
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: `${theme.typography.pxToRem(20)}`, pt: 1 }} variant="h1">
                  {+bnbValue.toFixed(6)} BNB
                </Typography>
              </Box>
              {/* <LinearProgressWrapper value={gauge} color="primary" variant="determinate" /> */}
              <Box px={1}>
                <SliderWrapper
                  aria-label="Amount"
                  defaultValue={30}
                  value={gauge}
                  valueLabelDisplay="auto"
                  // step={5}
                  // marks
                  min={0}
                  max={100}
                  onChange={handleChange}
                />
              </Box>
              <BoxButtons px={3} py={2}>
                <IconButtonIncrement onClick={handleGaugeDecreaseEvent}>
                  <RemoveTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
                <IconButtonIncrement onClick={handleGaugeIncreaseEvent}>
                  <AddTwoToneIcon fontSize="medium" />
                </IconButtonIncrement>
              </BoxButtons>
            </Box>

            <Box px={3} py={2}>
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Button
                    size="small"
                    disabled={+bnbValue === 0}
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleOpenDialog}>
                    <b> {t('Remove funds')}</b>
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button size="small" fullWidth variant="outlined" color="secondary" onClick={handleCloseForm}>
                    <b> {t('Return')}</b>
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
            {t('Are you sure to remove funds ? ')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 0, pr: 5, pl: 5 }} variant="body1">
            {t('We are listenning the adress directly from mempool to be as precise as possible.')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 5, pr: 5, pl: 5 }} variant="body1">
            {t(
              'Most of the time, you will play on the same block, but sometime, it could play on the next block and could be beatted for you but works for player.'
            )}
          </Typography>

          {/* <Button fullWidth size="large" variant="contained" color="error" onClick={sumbitRemoveFunds}>
            {t('Remove funds')}
          </Button> */}
          <LoadingButton fullWidth onClick={sumbitRemoveFunds} loading={pending} variant="contained" color="error">
            {t('Remove funds')}
          </LoadingButton>
        </Box>
      </DialogWrapper>
    </>
  )
}

RemoveFundsForm.propTypes = {
  user: PropTypes.shape({
    address: PropTypes.string.isRequired,
    generated: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    generatedBalance: PropTypes.string.isRequired,
  }).isRequired,
  handleCloseForm: PropTypes.func.isRequired,
}

export default RemoveFundsForm
