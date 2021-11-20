import 'moment-timezone'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { ethers } from 'ethers'
import { Formik } from 'formik'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import { forwardRef, ReactElement, Ref, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Moment from 'react-moment'
import { useDeleteStrategieMutation } from 'src/client/graphql/deleteStrategie.generated'
import { useToogleActivateStrategieMutation } from 'src/client/graphql/toogleActivateStrategie.generated'
import { useUpdateStrategieMutation } from 'src/client/graphql/updateStrategie.generated'
import { useGlobalStore } from 'src/client/store/swr'
import loadPlayer from 'src/client/thegraph/loadPlayer'
import * as Yup from 'yup'

const CardAddAction = styled(Card)(
  ({ theme }) => `
        color: ${theme.colors.primary.main};
        height: 100%;
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
          border-radius: inherit;
          border: ${theme.colors.primary.main} dashed 2px;

          &:hover {
            border-color: ${theme.colors.primary.dark};
          }
        }
        
        .MuiTouchRipple-root {
          opacity: .1;
        }
`
)

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
)

const CardActiveStrategies = styled(Card)(
  ({ theme }) => `
      color: ${theme.colors.primary.main};
      width: 100%;

      &.Mui-active {
        background: ${theme.palette.secondary.light};
        border: 1px solid ${theme.palette.primary.main};
        color: ${theme.palette.primary.contrastText};
        box-shadow: ${theme.colors.shadows.primary};

        .MuiCardActionArea-root {
          .MuiSvgIcon-root,
          .MuiSwitch-root .MuiSwitch-switchBase.Mui-checked,
          .MuiTypography-root,
          .MuiTypography-caption {
            color: ${theme.colors.alpha.white[100]};
          }

          .MuiSwitch-root .MuiSwitch-switchBase {

            .MuiSwitch-thumb {
              background-color: ${theme.colors.alpha.white[100]};
            }

            & + .MuiSwitch-track {
              background-color: ${theme.colors.alpha.white[30]};
            }
          }
        }
      }

      &.Mui-error {
        border: 1px solid ${theme.palette.error.main};
        color: ${theme.palette.error.contrastText};
        box-shadow: ${theme.colors.shadows.error};

        .MuiCardActionArea-root {
          &:hover {
            border-color: ${theme.colors.error.main};
          }
        }
      }

      .MuiCardActionArea-root {
        padding: ${theme.spacing(3, 6, 3, 4)};
        height: 100%;
        align-items: flex-start;
        justify-content: center;
        display: flex;
        position: relative;
        flex-direction: column;
        border: transparent solid 1px;
        border-radius: inherit;
        transition: ${theme.transitions.create(['border', 'background'])};

        .MuiTypography-root {
          color: ${theme.colors.alpha.black[50]};
        }

        .MuiTypography-caption {
          color: ${theme.colors.alpha.black[100]};
        }

        .MuiSwitch-root {
          position: absolute;
          top: ${theme.spacing(2)};
          right: ${theme.spacing(2)};
        }

        &:hover {
          border-color: ${theme.colors.primary.main};
        }
      }
      
      .MuiTouchRipple-root {
        opacity: .1;
      }
`
)

// const IconWrapper = styled(Box)(
//   ({ theme }) => `
//       padding: ${theme.spacing(2, 0)};
//       color: ${theme.colors.primary.main};
//       margin-left: -7px;
// `
// )

const MenuIconWrapper = styled(Box)(
  ({ theme }) => `
      position: absolute;
      top: ${theme.spacing(2.5)};
      left: ${theme.spacing(2)};
`
)

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 8px;
        width: 80%;
        margin-top: ${theme.spacing(0.5)}; 
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
`
)

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
)

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
)

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

function ActiveStrategies({ strategies: pstrategies, fetching }) {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()
  const [, updateStrategie] = useUpdateStrategieMutation()

  // const [onMenuOpen, menuOpen] = useState<boolean>(false)

  const moreRef = useRef<HTMLButtonElement | null>(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (index, event) => {
    setAnchorEl({ [index]: event.currentTarget })
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [pending, setPending] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [openAlert, setOpenAlert] = useState(true)

  // const openMenu = (): void => {
  //   menuOpen(true)
  // }

  // const closeMenu = (): void => {
  //   menuOpen(false)
  // }

  // const theme = useTheme()
  const { mutate } = useGlobalStore()

  const [, toogleActivateStrategie] = useToogleActivateStrategieMutation()
  const [, deleteStrategieMutation] = useDeleteStrategieMutation()

  const { enqueueSnackbar } = useSnackbar()

  const locations = [
    {
      value: 'all',
      text: t('All strategies'),
    },
    {
      value: 'active',
      text: t('Active strategies'),
    },
    {
      value: 'innactive',
      text: t('Innactive strategies'),
    },
    {
      value: 'deleted',
      text: t('Deleted strategie'),
    },
  ]

  const [location, setLocation] = useState<string>(locations[0].text)
  const [locationValue, setLocationValue] = useState<string>(locations[0].value)

  const [strategies, setStrategies] = useState<any[]>(pstrategies)
  const [activeStrategie, setActiveStrategie] = useState<any>(null)
  const [open, setOpen] = useState<boolean>(false)

  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)

  const handleOpenDialog = (strategie) => async () => {
    setOpenDialog(true)
    setAnchorEl(null)
    setActiveStrategie(strategie)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setPending(false)
    setActiveStrategie(null)
  }
  const handleChange = (strategie) => async () => {
    const updateds = strategies.map((s) => {
      const updated = s
      if (updated.id === strategie.id) updated.isActive = !updated.isActive

      return updated
    })
    setStrategies(updateds)

    const { error } = await toogleActivateStrategie({ id: strategie.id })

    if (error) {
      enqueueSnackbar(t(`Unexpected error during strategie ${strategie.isActive ? 'activation' : 'desactivation'}.`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    } else {
      enqueueSnackbar(t(`Stratégie successfully ${strategie.isActive ? 'activated' : 'desactivated'}.`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })
    }
    mutate('currentUser')
  }

  const loadStrategiesHistory = useCallback(async (plstrategies) => {
    const loadHistoryForStrategie = async (strategie) => {
      try {
        const { bets, ...enriched } = await loadPlayer(strategie.generated)
        return {
          ...strategie,
          bets,
          enriched,
        }
      } catch (error) {
        return {
          ...strategie,
        }
      }
    }
    try {
      const updateds = await Promise.all(plstrategies.map(loadHistoryForStrategie))

      setStrategies(updateds)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (fetching) {
      return
    }

    if (!pstrategies) {
      // setStrategies(null)
      return
    }
    console.log('useEffect')

    if (strategies) return

    console.log('useEffect -> updating strategies')

    loadStrategiesHistory(pstrategies)

    // const lstrategies = pstrategies.sort((x, y) => {
    //   // return x.isActive === y.isActive ? 0 : x.isActive ? -1 : 1
    //   return x.isDeleted ? 1 : y.isDeleted ? 1 : x.isActive - y.isActive
    // })
    // setStrategies(lstrategies)
    // loadStrategiesHistory(lstrategies)
  }, [fetching, pstrategies, strategies, loadStrategiesHistory])

  const getStrategieDuraction = (strategie) => {
    const duration = moment.duration(moment().diff(moment(strategie.createdAt)))

    // Get Days
    const days = Math.floor(duration.asDays())
    const daysFormatted = days ? `${days}d ` : ''

    // Get Hours
    const hours = duration.hours()
    const hoursFormatted = `${hours}h `

    // Get Minutes
    // const minutes = duration.minutes()
    // const minutesFormatted = `${minutes}m`

    return [daysFormatted, hoursFormatted].join('')
  }

  const deleteStrategie = async () => {
    setAnchorEl(null)

    setPending(true)

    try {
      const { error } = await deleteStrategieMutation({ id: activeStrategie.id })

      if (error) {
        enqueueSnackbar(t(`Unexpected error during strategie deletion.`), {
          variant: 'error',
          TransitionComponent: Zoom,
        })
        return
      }
      const updateds = strategies.map((s) => {
        const updated = s
        if (updated.id === activeStrategie.id) updated.isDeleted = !updated.isDeleted

        return updated
      })
      setStrategies(updateds)

      enqueueSnackbar(t(`Stratégie successfully deleted.`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })
    } catch (error) {
      enqueueSnackbar(t('Unexpected error during strategie deletion.'), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }
    mutate('currentUser')
    handleCloseDialog()
  }

  const handleUpdateUserForStrategieOpen = (strategie) => () => {
    setActiveStrategie(strategie)
    setOpen(true)
    // closeMenu()
    setAnchorEl(null)
  }

  const handleUpdateUserForStrategieClose = () => {
    setOpen(false)
    // closeMenu()
    setAnchorEl(null)
  }

  const handleUpdateUserForStrategie = () => {
    enqueueSnackbar(t('The user account was successfully updated'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    })

    setOpen(false)
    setAnchorEl(null)
  }

  const onSubmit = async (_values, { resetForm, setErrors, setStatus, setSubmitting }) => {
    const { player } = _values

    try {
      ethers.utils.getAddress(player)
    } catch (err) {
      enqueueSnackbar(t('Not a valid address.'), {
        variant: 'error',
      })
      return
    }

    try {
      const { error } = await updateStrategie({ id: activeStrategie.id, player })

      if (error) throw new Error(error.message)

      resetForm()
      setStatus({ success: true })
      setSubmitting(false)
      handleUpdateUserForStrategie()
      // mutate('currentUser')

      const updateds = strategies.map((s) => {
        const updated = s
        if (updated.id === activeStrategie.id) updated.player = player

        return updated
      })
      setStrategies(updateds)
    } catch (err) {
      console.error(err)
      setStatus({ success: false })
      setErrors({ submit: err.message })
      setSubmitting(false)
      enqueueSnackbar(t('Unexpected error occurred during user update.'), {
        variant: 'error',
      })
    }
  }

  const getWinrateForStrategie = (strategie) => {
    if (!strategie) return '... '
    if (!strategie.bets) return '... '

    const winsCount = strategie.bets.map((b) => b.position === b.round?.position).filter(Boolean)

    const winRate = ((winsCount.length * 100) / strategie.bets.length).toFixed(0)

    return `${winRate}% `
  }

  return (
    <>
      <Box>
        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="h3">{location}</Typography>
            <IconButton sx={{ ml: 1 }} color="primary" ref={actionRef} onClick={() => setOpenMenuLocation(true)}>
              <UnfoldMoreTwoToneIcon />
            </IconButton>
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
                    setLocationValue(_location.value)
                    setOpenMenuLocation(false)
                  }}>
                  {_location.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Button color="secondary" href="/app/players" size="small" variant="contained">
            {t('Add strategie')}
          </Button>
        </Box>
        <Grid container spacing={3}>
          {fetching ? (
            <Grid sx={{ py: 11 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item>
                <CircularProgress color="secondary" size="1rem" />
              </Grid>
            </Grid>
          ) : strategies?.length ? (
            <>
              {strategies
                .filter((strategie) => {
                  if (locationValue === 'all') return true
                  if (strategie.isActive && !strategie.isDeleted && locationValue === 'active') return true
                  if (!strategie.isActive && !strategie.isDeleted && locationValue === 'innactive') return true
                  if (strategie.isDeleted && locationValue === 'deleted') return true
                  return false
                })
                .sort((x, y) => {
                  return x.isActive === y.isActive && x.isActive === true ? 0 : y.isDeleted ? -1 : x.isActive ? -1 : 1
                })
                .map((strategie) => (
                  <Grid item xs={12} xl={3} md={4} sm={6} key={strategie.id}>
                    <CardActiveStrategies
                      className={
                        strategie.isError || strategie.isDeleted ? 'Mui-error' : strategie.isActive ? 'Mui-active' : ''
                      }>
                      <CardActionArea>
                        <Box>
                          <Tooltip placement="top" title={t('More options')} arrow>
                            {/* <MenuIconWrapper color="primary" onClick={openMenu} onClick={handleClick} ref={moreRef}> */}
                            <MenuIconWrapper
                              color="primary"
                              onClick={(e) => handleClick(strategie.id, e)}
                              ref={moreRef}>
                              <MoreVertTwoToneIcon />
                            </MenuIconWrapper>
                          </Tooltip>
                          <Menu
                            keepMounted
                            anchorEl={
                              // Check to see if the anchor is set.
                              anchorEl && anchorEl[strategie.id]
                            }
                            open={
                              // Likewise, check here to see if the anchor is set.
                              Boolean(anchorEl && anchorEl[strategie.id])
                            }
                            // anchorEl={moreRef.current}
                            // open={onMenuOpen}
                            // onClose={closeMenu}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}>
                            <List sx={{ p: 1 }} component="nav">
                              <ListItem button>
                                <ListItemText
                                  onClick={handleUpdateUserForStrategieOpen(strategie)}
                                  primary={t('Edit player')}
                                />
                              </ListItem>
                              <ListItem button disabled>
                                <ListItemText primary={t('Edit strategie')} />
                              </ListItem>
                              <ListItem button disabled>
                                <ListItemText primary={t('View strategie history')} />
                              </ListItem>
                              <ListItem button color="danger">
                                {/* <ListItemText onClick={deleteStrategie(strategie)} primary={t('Delete strategie')} /> */}
                                <ListItemText onClick={handleOpenDialog(strategie)} primary={t('Delete strategie')} />
                              </ListItem>
                            </List>
                          </Menu>
                        </Box>
                        {!strategie.isDeleted && (
                          <Box>
                            <Tooltip
                              placement="top"
                              title={t(`${strategie.isActive ? 'Desactivate' : 'Activate'} strategie`)}
                              arrow>
                              <Switch
                                edge="end"
                                checked={strategie.isActive}
                                color="primary"
                                // disabled={strategie.isDeleted}
                                onChange={handleChange(strategie)}
                              />
                            </Tooltip>
                          </Box>
                        )}

                        <Box sx={{ pl: 1.5 }} display="flex" alignItems="center">
                          {!strategie.isDeleted && (
                            <DotLegend
                              style={{
                                background: strategie.isActive
                                  ? theme.colors.success.main
                                  : strategie.isError
                                  ? theme.colors.error.main
                                  : theme.colors.warning.main,
                              }}
                            />
                          )}
                          <Box sx={{ pl: 0.5 }}>
                            <Typography fontWeight="bold" variant="caption" color="primary">
                              {strategie.isError
                                ? t('Error')
                                : strategie.isDeleted
                                ? 'Deleted'
                                : strategie.isActive
                                ? t('Active')
                                : t('Innactive')}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ py: 1 }}>
                          <Grid spacing={2} container>
                            {/* <Grid item xs={12} sm={3} alignItems="left">
                            <IconWrapper>
                              <AccountCircleIcon fontSize="large" />
                            </IconWrapper>
                          </Grid> */}
                            <Grid item xs={12}>
                              <Typography variant="h4" noWrap sx={{ pt: 3 }}>
                                {t('Player')}:{' '}
                                <Link
                                  variant="h5"
                                  href={`https://bscscan.com/address/${strategie.player}`}
                                  target="_blank">
                                  {strategie.player.substring(0, 20)}
                                </Link>
                              </Typography>
                              <Typography variant="h4" noWrap sx={{ pt: 1 }}>
                                {t('Generated')}:{' '}
                                <Link
                                  variant="h5"
                                  href={`https://bscscan.com/address/${strategie.generated}`}
                                  target="_blank">
                                  {strategie.generated.substring(0, 20)}
                                </Link>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                        <Divider />
                        <Box sx={{ pt: 2, py: 1 }}>
                          <Grid spacing={2} container>
                            <Grid item xs={12} sm={8}>
                              <Typography variant="h5" sx={{ pb: 1 }} component="div">
                                {t('Rounds played')}(%)
                              </Typography>
                              <Box>
                                <Typography color="text.primary" variant="h2" sx={{ pr: 0.5, display: 'inline-flex' }}>
                                  {strategie.playsCount}
                                </Typography>
                                <Typography color="text.secondary" variant="h4" sx={{ pr: 2, display: 'inline-flex' }}>
                                  / {strategie.roundsCount}
                                </Typography>
                                <LinearProgressWrapper
                                  value={(strategie.playsCount * 100) / strategie.roundsCount}
                                  // color="primary"
                                  color={
                                    (strategie.playsCount * 100) / strategie.roundsCount >= 30
                                      ? 'success'
                                      : (strategie.playsCount * 100) / strategie.roundsCount >= 20
                                      ? 'warning'
                                      : 'error'
                                  }
                                  variant="determinate"
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="h5" sx={{ pb: 1 }} component="div">
                                {t('Winrate')}
                              </Typography>
                              <Box>
                                <Typography color="text.primary" variant="h3" sx={{ display: 'inline-flex' }}>
                                  {/* {parseInt(`${strategie?.enriched?.winRate}`, 10) || '...'}% */}
                                  {getWinrateForStrategie(strategie)}
                                </Typography>
                                <DotLegend
                                  style={{
                                    background:
                                      +strategie?.enriched?.winRate >= 55
                                        ? theme.colors.success.main
                                        : +strategie?.enriched?.winRate >= 50
                                        ? theme.colors.warning.main
                                        : theme.colors.error.main,
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        <Divider />

                        <Box sx={{ py: 1, pt: 1 }}>
                          <Grid spacing={1} container>
                            <Grid item xs={12}>
                              <Typography variant="h4" sx={{ fontSize: '13px' }} component="div">
                                {t('Bankroll')} <b>{`${+strategie.currentAmount.toFixed(4)} BNB `}</b> (
                                {parseInt(`${(+strategie.currentAmount * 100) / strategie.startedAmount - 100}`, 10)}%)
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box sx={{ py: 1, pt: 0.5 }}>
                          <Grid spacing={1} container>
                            <Grid item xs={12}>
                              <Typography variant="h5" sx={{ fontSize: '11px' }} component="div">
                                {t('Running since')} <b>{getStrategieDuraction(strategie)}</b>
                              </Typography>
                              {strategie?.bets?.length && (
                                <Typography sx={{ fontSize: `${theme.typography.pxToRem(10)}`, pt: 0.5 }} variant="h6">
                                  {t('Last Play')}
                                  {' : '}
                                  <Moment local>{moment(+strategie?.bets[0]?.createdAt * 1000)}</Moment>
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      </CardActionArea>
                      {/* {!strategie.isActive && (
                      <>
                        <Divider />
                        <Box px={3} py={2}>
                          <Grid container spacing={3}>
                            <Grid item md={6}>
                              <Button
                                size="small"
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={deleteStrategie(strategie)}>
                                <b> {t('Delete')}</b>
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </>
                    )} */}
                    </CardActiveStrategies>
                  </Grid>
                ))}
            </>
          ) : (
            <></>
          )}

          <Grid item xs={12} xl={3} md={4} sm={6}>
            <Link href="/app/players" variant="body2" underline="hover">
              <Tooltip placement="right" arrow title={t('Add new strategie')}>
                <CardAddAction>
                  <CardActionArea sx={{ px: 1 }}>
                    <CardContent>
                      <AvatarAddWrapper>
                        <AddTwoToneIcon fontSize="large" />
                      </AvatarAddWrapper>
                    </CardContent>
                  </CardActionArea>
                </CardAddAction>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleUpdateUserForStrategieClose}>
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {t('Update player')}
          </Typography>
          <Typography variant="subtitle2">{t('Update the player for current strategie')}</Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            // player: activeStrategie?.player || '',
            player: '',
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            player: Yup.string().max(255).required(t('The player field is required')),
          })}
          onSubmit={onSubmit}>
          {({ errors, handleBlur, handleChange: handleChangeForm, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          label={t('Player')}
                          name="player"
                          onBlur={handleBlur}
                          onChange={handleChangeForm}
                          value={values.player}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button color="secondary" onClick={handleUpdateUserForStrategieClose}>
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained">
                  {t('Update player')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
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
            {t('Are you sure to delete strategie ? ')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 0, pr: 5, pl: 5 }} variant="body1">
            {t('We will stop the stratégie and send funds back to your secondary address.')}
          </Typography>
          <Typography align="center" sx={{ py: 4, pt: 0, pb: 5, pr: 5, pl: 5 }} variant="body1">
            {t('This will generate transaction and platform fees (0 during beta).')}
          </Typography>

          <LoadingButton fullWidth onClick={deleteStrategie} loading={pending} variant="contained" color="error">
            {t('Delete strategie')}
          </LoadingButton>
        </Box>
      </DialogWrapper>
    </>
  )
}

export default ActiveStrategies
