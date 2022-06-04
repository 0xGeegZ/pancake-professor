import 'moment-timezone'

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LoadingButton from '@mui/lab/LoadingButton'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'

import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'

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
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Slider,
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
import SidebarPlayerDrawer from 'src/client/components/Management/Users/SidebarPlayerDrawer'
import { useDeleteStrategieMutation } from 'src/client/graphql/deleteStrategie.generated'
import { useToogleActivateStrategieMutation } from 'src/client/graphql/toogleActivateStrategie.generated'
import { useUpdateStrategieMutation } from 'src/client/graphql/updateStrategie.generated'
import { useGlobalStore } from 'src/client/store/swr'
import loadPlayer from 'src/client/thegraph/loadPlayer'
import * as Yup from 'yup'
import { useToogleFavoritePlayerMutation } from 'src/client/graphql/toogleFavoritePlayer.generated'

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

// interface Props {
//   children: React.ReactElement
//   value: number
// }
// const ValueLabelComponent = (props: Props) => {
//   const { children, value } = props

//   return (
//     <Tooltip enterTouchDelay={0} placement="top" title={value}>
//       {children}
//     </Tooltip>
//   )
// }

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

// function ActiveStrategies({ strategies: pstrategies, favorites: pfavorites, fetching }) {
function ActiveStrategies({ user: puser, fetching }) {
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

  const [user, setUser] = useState<any>(null)
  // const [strategies, setStrategies] = useState<any[]>(null)
  // const [favorites, setFavorites] = useState<any[]>(null)
  const [withoutHistory, setWithoutHistory] = useState<any[]>(null)
  const [activeStrategie, setActiveStrategie] = useState<any>(null)
  // const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
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

  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  const handleDrawerToggle = () => {
    setAnchorEl(null)
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerSetPlayer = (playerId) => {
    setSelectedPlayerId(playerId)
  }

  const handleChange = (strategie) => async () => {
    const updateds = user?.strategies.map((s) => {
      const updated = s
      if (updated.id === strategie.id) {
        updated.isActive = !updated.isActive
        updated.isError = false
      }
      return updated
    })
    // setStrategies(updateds)
    const newUser = user
    newUser.strategies = updateds
    setUser(newUser)

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

  const loadStrategiesHistory = useCallback(async (ppuser) => {
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
      const updateds = await Promise.all(ppuser.strategies.map(loadHistoryForStrategie))

      const newUser = ppuser
      newUser.strategies = updateds
      setUser(newUser)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (fetching) {
      return
    }

    // setFavorites(pfavorites)

    if (!puser) {
      // setStrategies(null)
      return
    }

    // if (user) return
    // console.log('useEffect')

    if (puser.strategies) {
      // check if strategies was updateds
      // console.log('IS SAME', JSON.stringify(pstrategies) === JSON.stringify(withoutHistory))

      if (JSON.stringify(puser.strategies) === JSON.stringify(withoutHistory)) return

      // console.log('pstrategies', pstrategies)
      // console.log('strategies', withoutHistory)
    }

    console.log('useEffect -> updating strategies')
    setMobileOpen(false)

    setUser(puser)
    setWithoutHistory(puser.strategies)

    loadStrategiesHistory(puser)

    // const lstrategies = pstrategies.sort((x, y) => {
    //   // return x.isActive === y.isActive ? 0 : x.isActive ? -1 : 1
    //   return x.isDeleted ? 1 : y.isDeleted ? 1 : x.isActive - y.isActive
    // })
    // setStrategies(lstrategies)
    // loadStrategiesHistory(lstrategies)
  }, [fetching, loadStrategiesHistory, withoutHistory, puser])

  const getStrategieDuraction = (timestamp) => {
    const duration = moment.duration(moment().diff(moment(timestamp)))

    // Get Days
    const days = Math.floor(duration.asDays())
    const daysFormatted = days ? `${days}d ` : ''

    // Get Hours
    const hours = duration.hours()
    const hoursFormatted = `${hours}h `

    // Get Minutes
    const minutes = duration.minutes()
    const minutesFormatted = `${minutes}m`

    return [daysFormatted, hoursFormatted, minutesFormatted].join('')
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
      const updateds = user.strategies.map((s) => {
        const updated = s
        if (updated.id === activeStrategie.id) updated.isDeleted = !updated.isDeleted

        return updated
      })

      const newUser = user
      newUser.strategies = updateds
      setUser(newUser)
      // setStrategies(updateds)

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

  const handleUpdateStrategieOpen = (strategie) => () => {
    setActiveStrategie(strategie)
    setOpen(true)
    // closeMenu()
    setAnchorEl(null)
  }

  const handleUpdateStrategieClose = () => {
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
    const { player, stopLoss, takeProfit, name, color, betAmountPercent, isTrailing, bankrol } = _values
    console.log('🚀 ~ file: ActiveStrategies.tsx ~ line 533 ~ onSubmit ~ bankrol', bankrol)
    console.log(
      '🚀 ~ file: ActiveStrategies.tsx ~ line 533 ~ onSubmit ~ activeStrategie.startedAmount',
      activeStrategie.startedAmount
    )
    console.log(
      '🚀 ~ file: ActiveStrategies.tsx ~ line 533 ~ onSubmit ~ bankrol - activeStrategie.stratedAmount',
      bankrol - activeStrategie.startedAmount
    )

    let increaseAmount = 0.0
    let decreaseAmount = 0.0

    if (bankrol > 0) increaseAmount = bankrol
    else if (bankrol < 0) decreaseAmount = bankrol
    // else if (bankrol < 0) decreaseAmount = Math.abs(bankrol)

    // if (bankrol - activeStrategie.startedAmount > 0) increaseAmount = bankrol - activeStrategie.startedAmount
    // else if (bankrol - activeStrategie.startedAmount < 0) decreaseAmount = bankrol - activeStrategie.startedAmount

    console.log('🚀 ~ file: ActiveStrategies.tsx ~ line 537 ~ onSubmit ~ increaseAmount', increaseAmount)
    console.log('🚀 ~ file: ActiveStrategies.tsx ~ line 537 ~ onSubmit ~ decreaseAmount', decreaseAmount)

    try {
      ethers.utils.getAddress(player)
    } catch (err) {
      enqueueSnackbar(t('Not a valid address.'), {
        variant: 'error',
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

    const maxLooseAmount = +((stopLoss * activeStrategie.startedAmount) / 100).toFixed(4)
    console.log('🚀 ~ file: ActiveStrategies.tsx ~ line 476 ~ onSubmit ~ maxLooseAmount', maxLooseAmount)
    const minWinAmount = +((takeProfit * activeStrategie.startedAmount) / 100).toFixed(4)
    console.log('🚀 ~ file: ActiveStrategies.tsx ~ line 478 ~ onSubmit ~ minWinAmount', minWinAmount)

    try {
      const { error /* , data */ } = await updateStrategie({
        id: activeStrategie.id,
        player,
        maxLooseAmount,
        minWinAmount,
        betAmountPercent,
        isTrailing,
        name,
        color,
        increaseAmount,
        decreaseAmount,
      })

      if (error) throw new Error(error.message)

      // const { updateStrategie: updated } = data
      resetForm()
      setStatus({ success: true })
      setSubmitting(false)
      handleUpdateUserForStrategie()
      // mutate('currentUser')

      // const updateds = strategies.map((strategie) => (strategie.id === activeStrategie.id ? updated : strategie))
      const updateds = user.strategies.map((s) => {
        const strategie = s
        if (strategie.id === activeStrategie.id) {
          strategie.player = player
          strategie.name = name
          strategie.color = color
          strategie.isTrailing = isTrailing
          strategie.betAmountPercent = betAmountPercent
          strategie.maxLooseAmount = maxLooseAmount
          strategie.minWinAmount = minWinAmount
        }

        return strategie
      })

      const newUser = user
      newUser.strategies = updateds
      setUser(newUser)
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

  const getStrategieValue = (strategie) => {
    const currentAmountPercent = parseInt(`${(strategie?.currentAmount * 100) / strategie?.minWinAmount}`, 10)
    // const currentAmount = parseFloat(`${strategie?.currentAmount}`).toFixed(4)

    return currentAmountPercent
    // currentAmountPercent =
    //   strategie?.currentAmount <= strategie?.startedAmount - strategie?.maxLooseAmount
    //     ? currentAmountPercent - 30
    //     : currentAmountPercent

    // return currentAmountPercent
  }

  const getStrategieMarks = (strategie) => {
    // const stopLoss = parseInt(
    //   `${((strategie?.startedAmount - strategie?.maxLooseAmount) * 100) / strategie?.startedAmount}`,
    //   10
    // )

    if (!strategie) return []

    const takeProfit = parseInt(`${(strategie?.minWinAmount * 100) / strategie?.startedAmount}`, 10)
    const currentAmountPercent = parseInt(`${(strategie?.currentAmount * 100) / strategie?.minWinAmount}`, 10)
    const currentAmount = parseFloat(`${strategie?.currentAmount}`).toFixed(4)

    const marks = [
      // {
      //   value: 0,
      //   label: '0 BNB',
      // },
      {
        id: 1,
        // value: 20,
        // value: stopLoss,
        value:
          strategie?.currentAmount <= strategie?.startedAmount - strategie?.maxLooseAmount
            ? currentAmountPercent + 30
            : 15,
        // value: currentAmountPercent + 30,
        label: `${parseFloat(`${strategie?.startedAmount - strategie?.maxLooseAmount}`).toFixed(4)}`,
      },
      {
        id: 2,
        value: currentAmountPercent,
        // value:
        //   strategie?.currentAmount <= strategie?.startedAmount - strategie?.maxLooseAmount
        //     ? currentAmountPercent - 30
        //     : currentAmountPercent,
        label: `${currentAmount}`,
      },
      {
        id: 3,
        // value: takeProfit - 10,
        value:
          strategie?.currentAmount > strategie?.minWinAmount ? takeProfit - currentAmountPercent - 10 : takeProfit - 10,
        label: `${parseFloat(`${strategie.minWinAmount}`).toFixed(4)}`,
      },
    ]

    // const key = 'value'

    // const filtereds = [...new Map(marks.map((item) => [item[key], item])).values()]

    // if (filtereds.length !== marks.length) console.log('🚀 ~ filtereds', filtereds, 'marks', marks)

    return marks
  }

  const [, toogleFavoritePlayer] = useToogleFavoritePlayerMutation()

  const handleToogleFavoritePlayer = async (player: any, favorite: any) => {
    try {
      const { error } = await toogleFavoritePlayer({ player, ...favorite })

      if (error) throw new Error(error.message)

      enqueueSnackbar(
        t(
          `Player successfully ${
            favorite.type === 'LIKE'
              ? favorite.isNeedToFavorite
                ? 'favorited'
                : 'unfavorited'
              : favorite.isNeedToFavorite
              ? 'disliked'
              : 'undisliked'
          }`
        ),
        {
          variant: 'success',
          TransitionComponent: Zoom,
        }
      )
      mutate('currentUser')
    } catch (err) {
      console.error(err)
      enqueueSnackbar(t('Unexpected error occurred when favoriting/unfavoriting player.'), {
        variant: 'error',
      })
    }
  }

  // const valuetext = (value: number) => {
  //   return `${value} BNB`
  // }

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
          {/* {fetching || !strategies?.length ? ( */}
          {fetching && !user?.strategies?.length ? (
            <Grid sx={{ py: 11 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item>
                <CircularProgress color="secondary" size="1rem" />
              </Grid>
            </Grid>
          ) : user?.strategies?.length ? (
            <>
              {user?.strategies
                .filter((strategie) => {
                  if (locationValue === 'all' && !strategie.isDeleted) return true
                  if (strategie.isActive && !strategie.isDeleted && locationValue === 'active') return true
                  if (!strategie.isActive && !strategie.isDeleted && locationValue === 'innactive') return true
                  if (strategie.isDeleted && locationValue === 'deleted') return true
                  return false
                })
                .sort((x, y) => {
                  return x.isActive === y.isActive && x.isActive === true ? 0 : y.isDeleted ? -1 : x.isActive ? -1 : 1
                })
                .sort((x, y) => {
                  return x.isActive === y.isActive && x.isActive === true
                    ? +x.roundsCount > +y.roundsCount
                      ? -1
                      : 0
                    : 1
                })
                // .sort((x, y) => {
                //   return x.isActive === y.isActive && x.isActive === true
                //     ? +x.currentAmount > +y.currentAmount
                //       ? -1
                //       : 0
                //     : 1
                // })
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
                              // color="primary"
                              color={strategie.isActive ? 'primary' : 'black'}
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
                              {!strategie.isDeleted && (
                                <ListItem button>
                                  <ListItemText
                                    onClick={handleUpdateStrategieOpen(strategie)}
                                    primary={t('Edit strategie')}
                                  />
                                </ListItem>
                              )}
                              <ListItem button>
                                <ListItemText
                                  onClick={() => {
                                    handleDrawerToggle()
                                    handleDrawerSetPlayer(strategie.generated)
                                  }}
                                  primary={t('View strategie history')}
                                />
                              </ListItem>
                              <ListItem button>
                                <ListItemText
                                  onClick={() => {
                                    handleDrawerToggle()
                                    handleDrawerSetPlayer(strategie.player)
                                  }}
                                  primary={t('View player history')}
                                />
                              </ListItem>
                              {!strategie.isDeleted && (
                                <ListItem button color="danger">
                                  {/* <ListItemText onClick={deleteStrategie(strategie)} primary={t('Delete strategie')} /> */}
                                  <ListItemText onClick={handleOpenDialog(strategie)} primary={t('Delete strategie')} />
                                </ListItem>
                              )}
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
                                background:
                                  strategie.isActive && !strategie.isNeedRestart
                                    ? theme.colors.success.main
                                    : strategie.isError
                                    ? theme.colors.error.main
                                    : theme.colors.warning.main,
                              }}
                            />
                          )}

                          <Box sx={{ pl: 0.5 }}>
                            <Typography fontWeight="bold" variant="caption" color="primary">
                              {strategie.isDeleted
                                ? 'Deleted'
                                : strategie.isNeedRestart
                                ? t('Restarting')
                                : strategie.isError
                                ? strategie.currentAmount > strategie.minWinAmount
                                  ? t('Take Profit')
                                  : strategie.currentAmount < strategie.startedAmount - strategie.maxLooseAmount
                                  ? t('Stop Loss')
                                  : t('Error')
                                : strategie.isActive
                                ? t('Active')
                                : t('Innactive')}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ py: 1 }}>
                          <Grid spacing={2} container>
                            {/* <Grid item xs={12}>
                              <Typography variant="h4" noWrap sx={{ pt: 3 }}>
                                {t('Player')}:{' '}
                                <Link
                                  variant="h5"
                                  href={`https://bscscan.com/address/${strategie.player}`}
                                  target="_blank">
                                  {strategie.player.substring(0, 20)}
                                </Link>
                              </Typography>
                            </Grid> */}
                            <Grid item xs={12}>
                              <Typography variant="h4" noWrap sx={{ pt: 3 }}>
                                {t('Name')}: {strategie.name}{' '}
                                {user?.favorites?.find((f) => f.player === strategie?.player) && (
                                  <>
                                    {user?.favorites?.find(
                                      (f) => f.player === strategie?.player && f.type === 'LIKE'
                                    ) ? (
                                      <Tooltip placement="top" title={t('Current player is in favorites')} arrow>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          // onClick={() => {
                                          //   handleToogleFavoritePlayer(player.id, {
                                          //     type: 'LIKE',
                                          //     isNeedToFavorite: false,
                                          //   })
                                          // }}
                                        >
                                          <FavoriteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip placement="top" title={t('Current player is in unfavorites')} arrow>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          // onClick={() => {
                                          //   handleToogleFavoritePlayer(player.id, {
                                          //     type: 'DISLIKE',
                                          //     isNeedToFavorite: false,
                                          //   })
                                          // }}
                                        >
                                          <ThumbDownIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </>
                                )}
                              </Typography>
                              <Typography variant="h4" noWrap sx={{ pt: 1 }}>
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
                                {t('Rounds played')}
                              </Typography>
                              <Box>
                                <Typography color="text.primary" variant="h2" sx={{ pr: 0.5, display: 'inline-flex' }}>
                                  {strategie.bets && strategie.bets.length > strategie.playsCount
                                    ? strategie.bets.length
                                    : strategie.playsCount}
                                </Typography>
                                <Typography color="text.secondary" variant="h4" sx={{ pr: 2, display: 'inline-flex' }}>
                                  / {strategie.roundsCount}
                                </Typography>
                                <LinearProgressWrapper
                                  value={
                                    ((strategie.bets && strategie.bets.length > strategie.playsCount
                                      ? strategie.bets.length
                                      : strategie.playsCount) *
                                      100) /
                                    strategie.roundsCount
                                  }
                                  color={
                                    ((strategie.bets && strategie.bets.length > strategie.playsCount
                                      ? strategie.bets.length
                                      : strategie.playsCount) *
                                      100) /
                                      strategie.roundsCount >=
                                    30
                                      ? 'success'
                                      : ((strategie.bets && strategie.bets.length > strategie.playsCount
                                          ? strategie.bets.length
                                          : strategie.playsCount) *
                                          100) /
                                          strategie.roundsCount >=
                                        20
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
                              <Box pl={0}>
                                {/* <Typography color="text.primary" variant="h3" sx={{ display: 'inline-flex' }}>
                                  {parseInt(`${strategie?.enriched?.winRate}`, 10) || '...'}%
                                </Typography> */}
                                {getWinrateForStrategie(strategie) === '...' ? (
                                  <Tooltip
                                    title={t(
                                      'Winrate generaly start to be diplayed when adress have more than few hours.'
                                    )}
                                    arrow>
                                    <Typography color="text.primary" variant="h3" sx={{ display: 'inline-flex' }}>
                                      {getWinrateForStrategie(strategie)}
                                    </Typography>
                                  </Tooltip>
                                ) : (
                                  <Typography color="text.primary" variant="h3" sx={{ display: 'inline-flex' }}>
                                    {getWinrateForStrategie(strategie)}
                                  </Typography>
                                )}
                                {'  '}
                                <DotLegend
                                  style={{
                                    background:
                                      +getWinrateForStrategie(strategie) >= 55
                                        ? theme.colors.success.main
                                        : +getWinrateForStrategie(strategie) >= 50
                                        ? theme.colors.warning.main
                                        : theme.colors.error.main,
                                    // +strategie?.enriched?.winRate >= 55
                                    //   ? theme.colors.success.main
                                    //   : +strategie?.enriched?.winRate >= 50
                                    //   ? theme.colors.warning.main
                                    //   : theme.colors.error.main,
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
                            {strategie.maxLooseAmount && strategie.minWinAmount && (
                              <Grid item xs={12}>
                                {/* <Tooltip arrow placement="bottom" title={t('Share')}> */}

                                <Slider
                                  aria-label="Custom marks"
                                  defaultValue={getStrategieValue(strategie)}
                                  // getAriaValueText={valuetext}
                                  step={10}
                                  valueLabelDisplay="off"
                                  marks={getStrategieMarks(strategie)}
                                  color="secondary"
                                  //                           components={{
                                  //   ValueLabel: ValueLabelComponent,
                                  // }}
                                  // min={0}
                                  max={parseInt(`${(strategie?.minWinAmount * 100) / strategie?.startedAmount}`, 10)}
                                  disabled
                                />
                                {/* </Tooltip> */}

                                <Typography variant="h5" sx={{ fontSize: '11px', pt: 1 }} component="div">
                                  {t('Started Amount ')} <b>{strategie.startedAmount} BNB</b>
                                </Typography>
                                {strategie.minWinAmount && (
                                  <Typography variant="h5" sx={{ fontSize: '11px', pt: 0.3 }} component="div">
                                    {t('Take profit if win more than ')} <b>{strategie.minWinAmount} BNB</b>
                                  </Typography>
                                )}
                                {strategie.maxLooseAmount && (
                                  // <Typography variant="h5" sx={{ fontSize: '11px' }} component="div">
                                  //   {t('Stop Loss if loose more than ')} <b>{strategie.maxLooseAmount} BNB</b>
                                  // </Typography>
                                  <Typography variant="h5" sx={{ fontSize: '11px', pt: 0.3 }} component="div">
                                    {t('Stop Loss if bankroll is less than ')}{' '}
                                    <b>
                                      {parseFloat(`${strategie?.startedAmount - strategie?.maxLooseAmount}`).toFixed(4)}{' '}
                                      BNB
                                    </b>
                                  </Typography>
                                )}
                              </Grid>
                            )}
                          </Grid>
                        </Box>

                        <Box sx={{ py: 1, pt: 0.5 }}>
                          <Grid spacing={1} container>
                            <Grid item xs={12}>
                              {strategie?.bets?.length && (
                                <Typography sx={{ fontSize: `${theme.typography.pxToRem(10)}`, pt: 0.5 }} variant="h5">
                                  {t('Last Play')}
                                  {' : '}
                                  {getStrategieDuraction(+strategie?.bets[0]?.createdAt * 1000)}
                                  {/* {formatDistance(
                                    subDays(new Date(+strategie?.bets[0]?.createdAt * 1000), 1),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )} */}
                                  {/* <Moment local>{moment(+strategie?.bets[0]?.createdAt * 1000)}</Moment> */}
                                </Typography>
                              )}
                              {strategie?.isActive && (
                                <Typography variant="h5" sx={{ fontSize: '11px' }} component="div">
                                  {t('Running since')} {getStrategieDuraction(Date.parse(strategie.createdAt))}
                                  {/* {t('Launched')}{' '}
                                  <b>
                                    {formatDistance(
                                      subDays(new Date(+strategie?.createdAt || new Date().getTime()), 1),
                                      new Date(),
                                      {
                                        addSuffix: true,
                                      }
                                    )} 
                                  </b> */}
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
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleUpdateStrategieClose}>
        <DialogTitle sx={{ p: 3 }}>
          <Grid container spacing={1}>
            <Grid item md={10}>
              <Typography variant="h4" gutterBottom>
                {t('Update player')}
              </Typography>
              <Typography variant="subtitle2">{t('Update the player for current strategie')}</Typography>
            </Grid>
            <Grid item md={2}>
              <Grid container spacing={1}>
                {!user?.favorites?.find((f) => f.player === activeStrategie?.player) ? (
                  <>
                    <Grid item md={6}>
                      <Tooltip placement="top" title={t('Favorite current player')} arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            handleToogleFavoritePlayer(activeStrategie?.player, {
                              type: 'LIKE',
                              isNeedToFavorite: true,
                            })
                          }}>
                          <FavoriteBorderIcon fontSize="small" />
                          {/* <ThumbUpOffAltIcon fontSize="small" /> */}
                        </IconButton>
                      </Tooltip>
                    </Grid>

                    <Grid item md={6}>
                      <Tooltip placement="top" title={t('Favorite current player')} arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            handleToogleFavoritePlayer(activeStrategie?.player, {
                              type: 'DISLIKE',
                              isNeedToFavorite: true,
                            })
                          }}>
                          <ThumbDownOffAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </>
                ) : (
                  // <Tooltip placement="top" title={t('Unfavorite current player')} arrow>
                  //   <IconButton
                  //     size="small"
                  //     color="error"
                  //     onClick={() => {
                  //       handleToogleFavoritePlayer(activeStrategie?.player, false)
                  //     }}>
                  //     <FavoriteIcon fontSize="small" />
                  //   </IconButton>
                  // </Tooltip>
                  <>
                    <Grid item md={6}>
                      {user?.favorites?.find((f) => f.player === activeStrategie?.player && f.type === 'LIKE') ? (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            handleToogleFavoritePlayer(activeStrategie?.player, {
                              type: 'LIKE',
                              isNeedToFavorite: false,
                            })
                          }}>
                          <FavoriteIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            handleToogleFavoritePlayer(activeStrategie?.player, {
                              type: 'DISLIKE',
                              isNeedToFavorite: false,
                            })
                          }}>
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid item md={6}>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => {
                          handleUpdateStrategieClose()
                          handleDrawerToggle()
                          handleDrawerSetPlayer(activeStrategie?.player)
                        }}>
                        <StickyNote2Icon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogTitle>
        <Formik
          initialValues={{
            player: activeStrategie?.player || '',
            // bankrol: activeStrategie?.startedAmount.toFixed(4),
            bankrol: 0.0,
            name: activeStrategie?.name || '',
            color: activeStrategie?.color || '',
            betAmountPercent: activeStrategie?.betAmountPercent || 5,
            isTrailing: activeStrategie?.isTrailing,
            // player: '',
            // stopLoss: activeStrategie?.maxLooseAmount || 30,
            // takeProfit: activeStrategie?.minWinAmount || 150,
            stopLoss: activeStrategie?.maxLooseAmount
              ? parseInt(`${(activeStrategie?.maxLooseAmount * 100) / activeStrategie?.startedAmount}`, 10)
              : 30,
            takeProfit: activeStrategie?.minWinAmount
              ? parseInt(`${(activeStrategie?.minWinAmount * 100) / activeStrategie?.startedAmount}`, 10)
              : 150,
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            player: Yup.string().max(255).required(t('The player field is required')),
            bankrol: Yup.number()
              // TODO beter management
              // maximum amount is 95% of available balance
              .max(+`${+user?.generatedBalance - +user?.generatedBalance / 20}`)
              // max minimum amount is 50% of current amount
              .min(+`${+(activeStrategie?.currentAmount / 2) * -1}`)
              .required(t('The bankrol field is required')),
            name: Yup.string().max(100),
            color: Yup.string().max(7),
            betAmountPercent: Yup.number().min(2).max(50).required(t('The betAmount field is required')),
            isTrailing: Yup.boolean().required(t('The isTrailing field is required')),
            stopLoss: Yup.number().min(10).required(t('The stopLoss field is required')),
            takeProfit: Yup.number().min(110).required(t('The takeProfit field is required')),
          })}
          onSubmit={onSubmit}>
          {({ errors, handleBlur, handleChange: handleChangeForm, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={8}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            type="string"
                            helperText={touched.name && errors.name}
                            label={t('Name')}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChangeForm}
                            value={values.name}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <TextField
                            error={Boolean(touched.color && errors.color)}
                            fullWidth
                            type="string"
                            helperText={touched.color && errors.color}
                            label={t('Color')}
                            name="color"
                            onBlur={handleBlur}
                            onChange={handleChangeForm}
                            value={values.color}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.player && errors.player)}
                          fullWidth
                          helperText={touched.player && errors.player}
                          label={t('Player')}
                          name="player"
                          onBlur={handleBlur}
                          onChange={handleChangeForm}
                          value={values.player}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <TextField
                            error={Boolean(touched.betAmountPercent && errors.betAmountPercent)}
                            fullWidth
                            type="number"
                            helperText={touched.betAmountPercent && errors.betAmountPercent}
                            label={t('Bet Amount')}
                            name="betAmountPercent"
                            onBlur={handleBlur}
                            onChange={handleChangeForm}
                            value={values.betAmountPercent}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          {/* <TextField
                            error={Boolean(touched.color && errors.color)}
                            fullWidth
                            type="string"
                            helperText={touched.color && errors.color}
                            label={t('Color')}
                            name="color"
                            onBlur={handleBlur}
                            onChange={handleChangeForm}
                            value={values.color}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          /> */}
                          <Grid container display="flex" alignItems="center">
                            <Grid item xs={4}>
                              <Tooltip
                                placement="left"
                                title={`${t('Fixed : Bet amount will always be the same (more secure)')}`}
                                arrow>
                                <Typography>Fixed</Typography>
                                {/* <InfoIcon fontSize="small" /> */}
                              </Tooltip>
                            </Grid>

                            <Grid item xs={4}>
                              <Tooltip
                                placement="bottom-end"
                                title={`${
                                  values.isTrailing
                                    ? t(
                                        `Trailing : Bet amount will always be ${values.betAmountPercent}% of you balance (more volatile)`
                                      )
                                    : t('Fixed : Bet amount will always be the same (more secure)')
                                }`}
                                arrow>
                                <Switch
                                  checked={values.isTrailing}
                                  value={values.isTrailing}
                                  color="primary"
                                  // // error={Boolean(touched.color && errors.color)}
                                  // helperText={touched.color && errors.color}
                                  // label={t('isTrailing')}
                                  name="isTrailing"
                                  onBlur={handleBlur}
                                  onChange={handleChangeForm}
                                  // variant="outlined"
                                  // InputLabelProps={{
                                  //   shrink: true,
                                  // }}
                                />
                              </Tooltip>
                            </Grid>
                            <Grid item xs={4}>
                              <Tooltip
                                placement="right"
                                title={`${t(
                                  `Trailing : Bet amount will always be ${values.betAmountPercent}% of you balance (more volatile)`
                                )}`}
                                arrow>
                                <Typography>Trailing</Typography>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <Grid container display="flex" alignItems="center">
                            <Grid item xs={11}>
                              <TextField
                                error={Boolean(touched.stopLoss && errors.stopLoss)}
                                fullWidth
                                type="number"
                                helperText={touched.stopLoss && errors.stopLoss}
                                label={t('Stop Loss')}
                                name="stopLoss"
                                onBlur={handleBlur}
                                onChange={handleChangeForm}
                                value={values.stopLoss}
                                variant="outlined"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Tooltip
                                placement="bottom-end"
                                title={`${
                                  t('Stop if strategie loose more than ') + values.stopLoss
                                }% of started bankroll`}
                                arrow>
                                <IconButton color="secondary" size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <Grid container display="flex" alignItems="center">
                            <Grid item xs={11}>
                              <TextField
                                error={Boolean(touched.takeProfit && errors.takeProfit)}
                                fullWidth
                                type="number"
                                helperText={touched.takeProfit && errors.takeProfit}
                                label={t('Take Profit')}
                                name="takeProfit"
                                onBlur={handleBlur}
                                onChange={handleChangeForm}
                                value={values.takeProfit}
                                variant="outlined"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Tooltip
                                placement="bottom-end"
                                title={`${
                                  t('Stop if strategie won more than ') + values.takeProfit
                                }% of started bankroll`}
                                arrow>
                                <IconButton color="secondary" size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center' }} py={1}>
                          <Grid container display="flex" alignItems="center">
                            <Grid item xs={11}>
                              <TextField
                                error={Boolean(touched.bankrol && errors.bankrol)}
                                fullWidth
                                type="number"
                                helperText={touched.bankrol && errors.bankrol}
                                label={t('Increase or decrease bankroll amount')}
                                name="bankrol"
                                onBlur={handleBlur}
                                onChange={handleChangeForm}
                                value={values.bankrol}
                                variant="filled"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{
                                  step: '0.05',
                                }}
                                // eslint-disable-next-line react/jsx-no-duplicate-props
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">BNB</InputAdornment>,
                                }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Tooltip
                                placement="bottom-end"
                                title={`${
                                  t('Stop if strategie loose more than ') + values.stopLoss
                                }% of started bankroll`}
                                arrow>
                                <IconButton color="secondary" size="small">
                                  <InfoIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button color="secondary" onClick={handleUpdateStrategieClose}>
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
      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        elevation={9}>
        {mobileOpen && <SidebarPlayerDrawer playerId={selectedPlayerId} />}
      </Drawer>
    </>
  )
}

export default ActiveStrategies
