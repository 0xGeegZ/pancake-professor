/* eslint-disable import/order */
import 'moment-timezone'

import { PREDICTION_CONTRACT_ABI } from '@/contracts/abis/pancake-prediction-abi-v3'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import GamepadIcon from '@mui/icons-material/Gamepad'
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  Menu,
  Slider,
  MenuItem,
  FormControl,
  ListItemIcon,
  Checkbox,
  ListItemButton,
  ListItemText,
  InputLabel,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import { ethers } from 'ethers'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import { ChangeEvent, FC, forwardRef, MouseEvent, Ref, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FollowPlayerForm from 'src/client/components/Dashboards/Automation/FollowPlayerForm'
import { useGlobalStore } from 'src/client/store/swr'
import loadPlayers from 'src/client/thegraph/loadPlayers'
import { useToogleFavoritePlayerMutation } from 'src/client/graphql/toogleFavoritePlayer.generated'
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone'

import SidebarPlayerDrawer from './SidebarPlayerDrawer'

// import loadAllPlayers from 'src/client/thegraph/loadAllPlayers'
import type { ReactElement } from 'react'

import type { Player } from 'src/client/models/player'

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

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
)

const CardWrapper = styled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
    }
  `
)

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
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

const ListItemWrapper = styled(ListItemButton)(
  () => `
      &.MuiButtonBase-root {
        border-radius: 0;
      }
  `
)

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

const applyPagination = (players: Player[], page: number, limit: number): Player[] =>
  players.slice(page * limit, page * limit + limit)

const PlayersList: FC = () => {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [fetching, setFetching] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [hasError, setHasError] = useState<boolean>(false)
  const [preditionContract, setPreditionContract] = useState<any>(null)
  const [denominatorValue, setDenominatorValue] = useState<number>(0)

  const { user, mutate, fetching: userFetching } = useGlobalStore()

  // START FILTERS
  const actionRef2 = useRef<any>(null)
  const [openFilters, setOpenMenuFilters] = useState<boolean>(false)

  // const [type, setType] = useState('')

  // const handleType = (event) => {
  //   setType(event.target.value)
  // }

  const playerTypesFilter = [
    // {
    //   id: 1,
    //   name: 'All',
    //   value: 'all',
    // },
    {
      id: 1,
      name: 'Liked',
      value: 'liked',
    },
    {
      id: 2,
      name: 'Unliked',
      value: 'unliked',
    },
    {
      id: 3,
      name: 'Others',
      value: 'others',
    },
  ]

  const [playerTypesChecked, setPlayerTypesChecked] = useState([1, 3])

  const handleTogglePlayerTypes = (value: number) => () => {
    const currentIndex = playerTypesChecked.indexOf(value)
    const newChecked = [...playerTypesChecked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setPlayerTypesChecked(newChecked)
  }

  const [winrateRange, setWinrageRange] = useState<number[]>([55, 100])

  const handleWinrageRangeChange = (_event: Event, newValue: number | number[]) => {
    setWinrageRange(newValue as number[])
  }

  const [netbnbRange, setNetbnbRange] = useState<number[]>([-100, 1000])

  const handleNetbnbRangeChange = (_event: Event, newValue: number | number[]) => {
    setNetbnbRange(newValue as number[])
  }

  // END FILTERS

  const getPlayers = useCallback(
    async (ppreditionContract) => {
      if (fetching) return

      console.log('getPlayers')

      setFetching(true)
      try {
        const lisPaused = await ppreditionContract.paused()
        setIsPaused(lisPaused)
        if (lisPaused) {
          enqueueSnackbar(t(`Contract is actually paused`), {
            variant: 'error',
            TransitionComponent: Zoom,
          })
          // setFetching(false)
          // return
        }
        const epoch = await ppreditionContract.currentEpoch()

        let lplayers = await loadPlayers({ epoch })
        // TODO v0.0.3 add filter like/unlike only in page filter
        lplayers = lplayers.filter((p) => !user?.favorites.find((f) => f.player === p.id && f.type === 'DISLIKE'))
        // lplayers = lplayers.sort((p) => (user?.favorites.find((f) => f.player === p.id && f.type === 'LIKE') ? -1 : 0))

        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
        setFetching(false)
      }
    },
    [fetching, enqueueSnackbar, t, user]
  )

  const refreshQuery = useCallback(
    // async ({ orderBy, winRateMin, winRateMax }) => {
    async () => {
      console.log('refreshQuery')

      const epoch = await preditionContract.currentEpoch()

      setFetching(true)
      setPlayers([])
      players.length = 0

      const orderBy = orderByValue
      const winRateMin = winrateRange[0]
      const winRateMax = winrateRange[1]

      const netBnbMin = netbnbRange[0]
      const netBnbMax = netbnbRange[1]

      console.log(user.favorites)
      console.log(playerTypesChecked)

      const isOnlyplayerTypesFilterSelected = !playerTypesChecked.includes(3)
      const playerTypesFilterSelected = user.favorites
        .filter((favorite) => {
          if (favorite.type === 'LIKE' && playerTypesChecked.includes(1)) return true
          if (favorite.type === 'DISLIKE' && playerTypesChecked.includes(2)) return true
          return false
        })
        .map((f) => f.player)

      try {
        let lplayers = await loadPlayers({
          epoch,
          orderBy,
          winRateMin,
          winRateMax,
          netBnbMin,
          netBnbMax,
          selecteds: isOnlyplayerTypesFilterSelected ? playerTypesFilterSelected : '',
        })

        if (!playerTypesChecked.includes(2))
          lplayers = lplayers.filter((p) => !user.favorites.find((f) => f.player === p.id && f.type === 'DISLIKE'))

        // TODO v0.0.4 add sortBy, SEE : http://localhost:3000/dashboards/monitoring
        // if (playerTypesChecked.includes(1))
        //   lplayers = lplayers.sort((p) =>
        //     user?.favorites.find((f) => f.player === p.id && f.type === 'LIKE') ? -1 : 0
        //   )

        setDenominatorValue(orderBy === 'default' ? 288 : orderBy === 'mostActiveLastHour' ? 12 : 0)
        setPlayers(lplayers)

        setFetching(false)
      } catch (err) {
        setHasError(true)
        setFetching(false)
      }
    },
    [players, preditionContract, user, playerTypesChecked]
  )

  useEffect(() => {
    if (userFetching) return
    if (preditionContract) return

    // if (!user && !userFetching) {
    //   enqueueSnackbar(t(`You need to be connected to have data fecthing for this view.`), {
    //     variant: 'warning',
    //     TransitionComponent: Zoom,
    //   })
    //   return
    // }
    if (!window.ethereum?.request) {
      enqueueSnackbar(t(`You need to have metamask installed on your browser.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }

    const lprovider = new ethers.providers.Web3Provider(window.ethereum)

    // const signer = lprovider.getSigner()

    const lpreditionContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
      // signer,
      lprovider
    )

    setPreditionContract(lpreditionContract)

    try {
      getPlayers(lpreditionContract)
    } catch (err) {
      setHasError(true)
    }
  }, [getPlayers, user, preditionContract, enqueueSnackbar, t, userFetching])

  const ordersBy = [
    {
      value: 'default',
      text: t('Most actives from last 24 hours'),
    },
    {
      value: 'mostActiveLastHour',
      text: t('Most actives from last hour'),
    },
    {
      value: 'winRate',
      text: t('Best Winrate'),
    },
    {
      value: 'totalBets',
      text: t('Most active'),
    },
    {
      value: 'netBNB',
      text: t('Best Gain'),
    },
    {
      value: 'totalBNB',
      text: t('Total BNB'),
    },
  ]

  const actionRef1 = useRef<any>(null)
  const [openOrderBy, setOpenMenuOrderBy] = useState<boolean>(false)
  // const [orderBy, setOrderBy] = useState<string>(ordersBy[3].text)
  const [orderByText, setOrderByText] = useState<string>(ordersBy[3].text)
  const [orderByValue, setOrderByValue] = useState<string>(ordersBy[3].value)

  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(15)

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage)
  }

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(+event.target.value)
  }

  // const filteredPlayers = applyFilters(players, query, filters)
  const paginatedPlayers = applyPagination(players, page, limit)

  const [toggleView, setToggleView] = useState<string | null>('grid_view')

  const handleViewOrientation = (_event: MouseEvent<HTMLElement>, newValue: string | null) => {
    setToggleView(newValue)
  }

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false)
  }

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false)

    enqueueSnackbar(t('The player account has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    })
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerSetPlayer = (playerId) => {
    setSelectedPlayerId(playerId)
  }

  const [openCreateForm, setOpenCreateForm] = useState(false)
  const [activePlayer, setActivePlayer] = useState('')

  const handleOpenCreateForm = (pactivePlayer: string) => () => {
    setOpenCreateForm(true)
    setActivePlayer(pactivePlayer)
  }

  const handleCloseCreateForm = () => {
    setOpenCreateForm(false)
    mutate('currentUser')
  }

  const getStrategieDuration = (timestamp) => {
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

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}>
        <CardHeader
          action={
            <>
              <Button
                size="small"
                variant="outlined"
                ref={actionRef1}
                onClick={() => setOpenMenuOrderBy(true)}
                endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}>
                {orderByText}
              </Button>
              <Menu
                anchorEl={actionRef1.current}
                onClose={() => setOpenMenuOrderBy(false)}
                open={openOrderBy}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}>
                {ordersBy.map((_order) => (
                  <MenuItem
                    key={_order.value}
                    disabled={isPaused && _order.value === 'mostActiveLastHour'}
                    onClick={async () => {
                      setOrderByText(_order.text)
                      setOrderByValue(_order.value)

                      setOpenMenuOrderBy(false)
                      await refreshQuery()
                      // await refreshQuery({ orderBy: _order.value })
                    }}>
                    {_order.text}
                  </MenuItem>
                ))}
              </Menu>{' '}
              <Button
                size="small"
                variant="outlined"
                ref={actionRef2}
                onClick={() => setOpenMenuFilters(true)}
                endIcon={<FilterAltTwoToneIcon fontSize="small" />}>
                {t('Filters')}
              </Button>
              <Menu
                anchorEl={actionRef2.current}
                onClose={() => setOpenMenuFilters(false)}
                open={openFilters}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                <Box sx={{ pt: 1, /* minWidth: '360px', */ outline: 'none' }}>
                  <Grid container spacing={3}>
                    {/* <Grid item md={6}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{t('Type')}</InputLabel>
                        <Select label={t('Type')} value={type} onChange={handleType}>
                          <MenuItem value={0}>{t('All types')}</MenuItem>
                          <MenuItem value={1}>{t('Likes only')}</MenuItem>
                          <MenuItem value={2}>{t('Unlike only')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid> */}
                    <Grid item md={12}>
                      <Typography variant="h5">{t('Winrate range')}</Typography>
                      <Box sx={{ mx: 5, mt: 5 }}>
                        <Slider
                          value={winrateRange}
                          step={0.25}
                          min={50}
                          max={100}
                          onChange={handleWinrageRangeChange}
                          valueLabelDisplay="on"
                          valueLabelFormat={(value) => <div>{value}%</div>}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="h5">{t('Net BNB range')}</Typography>
                      <Box sx={{ mx: 5, mt: 5 }}>
                        <Slider
                          value={netbnbRange}
                          step={50}
                          min={-100}
                          max={1000}
                          onChange={handleNetbnbRangeChange}
                          valueLabelDisplay="on"
                          valueLabelFormat={(value) => <div>{value} BNB</div>}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="h5">{t('Players')}</Typography>

                      <List component="div">
                        {playerTypesFilter.map((value) => (
                          <ListItemWrapper
                            sx={{ py: 0, px: 2 }}
                            key={value.id}
                            onClick={handleTogglePlayerTypes(value.id)}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Checkbox
                                edge="start"
                                checked={playerTypesChecked.indexOf(value.id) !== -1}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <ListItemText primary={value.name} primaryTypographyProps={{ variant: 'body1' }} />
                          </ListItemWrapper>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mb: 2, mt: 2 }} />
                  <Box pb={1} display="flex" alignItems="center" justifyContent="center">
                    <Button
                      onClick={async () => {
                        setOpenMenuFilters(false)
                        await refreshQuery()
                        // await refreshQuery({
                        //   orderBy: orderByValue,
                        //   // winRateMin: winrateRange[0],
                        //   // winRateMax: winrateRange[1],
                        //   // netBnbMin: netbnbRange[0],
                        //   // netBnbMax: netbnbRange[1],
                        // })
                      }}
                      variant="contained"
                      size="small">
                      {t('Filter results')}
                    </Button>
                  </Box>
                </Box>
              </Menu>
            </>
          }
        />
        <Divider />
        <ToggleButtonGroup sx={{ mt: { xs: 2, sm: 0 } }} value={toggleView} exclusive onChange={handleViewOrientation}>
          <ToggleButton disableRipple value="table_view">
            <TableRowsTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="grid_view">
            <GridViewTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {toggleView === 'table_view' && (
        <Card>
          <Divider />

          {paginatedPlayers.length === 0 ? (
            fetching || userFetching ? (
              <>
                <Grid
                  sx={{ py: 10 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={3}>
                  <Grid item>
                    <CircularProgress color="secondary" size="1rem" />
                  </Grid>
                </Grid>
              </>
            ) : hasError ? (
              <>
                <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
                  {t('An unexpected error occured during contract query. Please, try again later')}
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
                  {t("We couldn't find any players matching your search criteria")}
                </Typography>
              </>
            )
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {paginatedPlayers[0]?.recentGames && (
                        <TableCell> {t(`Last ${denominatorValue / 12}`)}(%)</TableCell>
                      )}
                      <TableCell>{t('WinRate')}</TableCell>
                      <TableCell>{t('TotalBets')}</TableCell>
                      <TableCell>{t('NetBNB')}</TableCell>
                      <TableCell>{t('Address')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPlayers.map((player) => {
                      // const isPlayerSelected = selectedItems.includes(player.id)
                      return (
                        <TableRow hover key={player.id}>
                          {player.recentGames && (
                            <>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <DotLegend
                                    style={{
                                      background:
                                        (+player.recentGames * 100) / denominatorValue >= 30
                                          ? theme.colors.success.main
                                          : (+player.recentGames * 100) / denominatorValue >= 20
                                          ? theme.colors.warning.main
                                          : theme.colors.error.main,
                                    }}
                                  />
                                  <Box>
                                    {player.recentGames}/{denominatorValue} (
                                    {parseInt(`${(+player.recentGames * 100) / denominatorValue}`, 10)} %)
                                  </Box>
                                </Box>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {!player.recentGames && (
                                <DotLegend
                                  style={{
                                    background:
                                      +player.winRate >= 60
                                        ? theme.colors.success.main
                                        : +player.winRate >= 55
                                        ? theme.colors.warning.main
                                        : theme.colors.error.main,
                                  }}
                                />
                              )}
                              <Box>{parseFloat(player.winRate).toFixed(2)}%</Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {/* <DotLegend
                              style={{
                                background:
                                  (player.winRate * 100) / 100 > 60
                                    ? theme.colors.success.main
                                    : (player.winRate * 100) / 100 > 55
                                    ? theme.colors.warning.main
                                    : theme.colors.error.main,
                              }}
                            /> */}
                            <Box>
                              {player.totalBets} {t('bets')}
                            </Box>
                            {/* <Typography>
                              {player.totalBets} {t('bets')}
                            </Typography> */}
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {parseFloat(player.netBNB).toFixed(2)} {t('net BNB won')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Link
                              underline="hover"
                              variant="h5"
                              href={`https://bscscan.com/address/${player.id}`}
                              target="_blank">
                              <Typography fontWeight="bold">{player.id.substring(0, 10)}</Typography>
                            </Link>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              {!user ? (
                                <Tooltip placement="top" title={t('You need to be connected to copy player.')} arrow>
                                  <IconButton component={Link} color="warning">
                                    <GamepadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title={t('Copy')} arrow>
                                  <IconButton
                                    disabled={!!user?.strategies.find((s) => s.player === player.id)}
                                    component={Link}
                                    onClick={handleOpenCreateForm(player.id)}
                                    color="primary">
                                    <GamepadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={players.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15, 20]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
      {toggleView === 'grid_view' && (
        <>
          {paginatedPlayers.length === 0 ? (
            fetching || userFetching ? (
              <>
                <Card>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Grid
                      sx={{ py: 10 }}
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={3}>
                      <Grid item>
                        <CircularProgress color="secondary" size="1rem" />
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </>
            ) : hasError ? (
              <>
                <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
                  {t('An unexpected error occured during contract query. Please, try again later')}
                </Typography>
              </>
            ) : (
              <>
                <Card sx={{ p: 2, mb: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Grid
                      sx={{ py: 10 }}
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={3}>
                      <Typography
                        // sx={{ py: 10 }}
                        variant="h3"
                        fontWeight="normal"
                        color="text.secondary"
                        align="center">
                        {t("We couldn't find any players matching your search criteria")}
                      </Typography>
                    </Grid>
                  </Box>
                </Card>
              </>
            )
          ) : (
            <>
              <Card
                sx={{
                  p: 2,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Box>
                  <Typography component="span" variant="subtitle1">
                    {t('Showing')}
                  </Typography>{' '}
                  <b>{limit}</b> {t('of')} <b>{players.length}</b> <b>{t('players')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={players.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage=""
                  rowsPerPageOptions={[5, 10, 15, 20]}
                />
              </Card>
              <Grid container spacing={3}>
                {paginatedPlayers.map((player) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                      <CardWrapper>
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: '2',
                          }}>
                          {openCreateForm && activePlayer === player.id ? (
                            <>
                              <Divider />
                              <FollowPlayerForm
                                handleCloseCreateForm={handleCloseCreateForm}
                                player={player}
                                user={user}
                              />
                            </>
                          ) : (
                            <>
                              <Box>
                                <Box sx={{ px: 4, pt: 4, pb: 2 }}>
                                  <Typography variant="h3">
                                    <Link
                                      underline="hover"
                                      href={`https://bscscan.com/address/${player.id}`}
                                      target="_blank">
                                      {player.id.substring(0, 10)}
                                    </Link>
                                  </Typography>
                                  <Typography variant="subtitle2" gutterBottom>
                                    {t('Net BNB won')} : {parseFloat(player.netBNB).toFixed(2)} BNB
                                  </Typography>
                                  {player?.bets.length && (
                                    <Typography sx={{ fontSize: `${theme.typography.pxToRem(10)}` }} variant="h6">
                                      {t('Last Play')}
                                      {' : '}
                                      {getStrategieDuration(+player.bets[0].createdAt * 1000)}
                                      {/* <Moment local>{moment(+player.bets[0].createdAt * 1000)}</Moment> */}
                                      {/* {formatDistance(
                                        subDays(new Date(+player.bets[0].createdAt * 1000), 1),
                                        new Date(),
                                        {
                                          addSuffix: true,
                                        }
                                      )} */}
                                    </Typography>
                                  )}
                                </Box>
                                <Divider />
                                <Box sx={{ px: 4, py: 2 }}>
                                  <Grid spacing={2} container>
                                    <Grid item xs={12} sm={7}>
                                      <Typography variant="caption" sx={{ pb: 1 }} component="div">
                                        {t('WinRate')}(%)
                                      </Typography>
                                      <Box>
                                        <Typography
                                          color="text.primary"
                                          variant="h2"
                                          sx={{ pr: 0.5, display: 'inline-flex' }}>
                                          {parseInt(player.winRate.toString(), 10)}
                                        </Typography>
                                        <Typography
                                          color="text.secondary"
                                          variant="h4"
                                          sx={{ pr: 2, display: 'inline-flex' }}>
                                          /100
                                        </Typography>
                                        <LinearProgressWrapper
                                          value={+player.winRate}
                                          color={
                                            (+player.winRate * 100) / 100 >= 60
                                              ? 'success'
                                              : (+player.winRate * 100) / 100 >= 55
                                              ? 'warning'
                                              : 'error'
                                          }
                                          variant="determinate"
                                        />
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                      <Typography variant="caption" sx={{ pb: 1.5 }} component="div">
                                        {t('Total Bets')}
                                      </Typography>
                                      <Box display="flex" alignItems="center">
                                        <DotLegend
                                          style={{
                                            background:
                                              +player.totalBets >= 250
                                                ? theme.colors.success.main
                                                : +player.totalBets >= 100
                                                ? theme.colors.warning.main
                                                : theme.colors.error.main,
                                          }}
                                        />
                                        <Typography variant="h3" sx={{ pl: 1 }} component="div">
                                          {player.totalBets}
                                        </Typography>
                                      </Box>
                                    </Grid>

                                    {player.recentGames && (
                                      <>
                                        <Grid item xs={12} sm={7}>
                                          <Typography variant="caption" sx={{ pb: 1 }} component="div">
                                            {t(`Winrate last ${denominatorValue / 12}H`)}(%)
                                          </Typography>
                                          <Box>
                                            <Typography
                                              color="text.primary"
                                              variant="h2"
                                              sx={{ pr: 0.5, display: 'inline-flex' }}>
                                              {parseInt(`${+player.winRateRecents}`, 10)}
                                            </Typography>
                                            <Typography
                                              color="text.secondary"
                                              variant="h4"
                                              sx={{ pr: 2, display: 'inline-flex' }}>
                                              /100
                                            </Typography>
                                            <LinearProgressWrapper
                                              value={+player.winRateRecents}
                                              color={
                                                +player.winRateRecents >= 60
                                                  ? 'success'
                                                  : +player.winRateRecents >= 55
                                                  ? 'warning'
                                                  : 'error'
                                              }
                                              variant="determinate"
                                            />
                                          </Box>
                                          {/* <Box>
                                            <Typography
                                              color="text.primary"
                                              variant="h2"
                                              sx={{ pr: 0.5, display: 'inline-flex' }}>
                                              {parseInt(`${(+player.recentGames * 100) / denominatorValue}`, 10)}
                                            </Typography>
                                            <Typography
                                              color="text.secondary"
                                              variant="h4"
                                              sx={{ pr: 2, display: 'inline-flex' }}>
                                              /100
                                            </Typography>
                                            <LinearProgressWrapper
                                              value={(player.recentGames * 100) / denominatorValue}
                                              color={
                                                (player.recentGames * 100) / denominatorValue >= 30
                                                  ? 'success'
                                                  : (player.recentGames * 100) / denominatorValue >= 20
                                                  ? 'warning'
                                                  : 'error'
                                              }
                                              variant="determinate"
                                            />
                                          </Box> */}
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                          <Typography variant="caption" sx={{ pb: 1.5 }} component="div">
                                            {t(`Last ${denominatorValue / 12}H Bets`)}
                                          </Typography>
                                          <Box display="flex" alignItems="center">
                                            {/* <DotLegend
                                              style={{
                                                background:
                                                  +player.recentGames >= 250
                                                    ? theme.colors.success.main
                                                    : +player.totalBets >= 100
                                                    ? theme.colors.warning.main
                                                    : theme.colors.error.main,
                                              }}
                                            /> */}
                                            <Typography variant="h3" sx={{ pl: 1 }} component="div">
                                              {parseInt(`${(+player.recentGames * 100) / denominatorValue}`, 10)}%{' '}
                                              {/* {+player.recentGames}/{denominatorValue}{' '} */}
                                              <Typography variant="h5" component="span">
                                                <sup>
                                                  ({+player.recentGames}/{denominatorValue})
                                                  {/* ({parseInt(`${(+player.recentGames * 100) / denominatorValue}`, 10)}%) */}
                                                </sup>
                                              </Typography>
                                            </Typography>
                                          </Box>
                                        </Grid>
                                      </>
                                    )}
                                  </Grid>
                                </Box>
                              </Box>

                              <Divider />
                              <Box px={3} py={2}>
                                <Grid container spacing={1}>
                                  <Grid item md={5}>
                                    {!user ? (
                                      <Tooltip
                                        placement="top"
                                        title={t('You need to be connected to copy player.')}
                                        arrow>
                                        <Button size="small" fullWidth variant="outlined" color="warning">
                                          <b> {t('Copy')}</b>
                                        </Button>
                                      </Tooltip>
                                    ) : +user?.generatedBalance === 0 ? (
                                      <Tooltip
                                        placement="top"
                                        title={t('Need to have positive balance in secondary address to copy player')}
                                        arrow>
                                        {/* TODO 0.0.3 : Remove handleClick for production */}
                                        <Button
                                          size="small"
                                          fullWidth
                                          variant="outlined"
                                          color="warning"
                                          onClick={handleOpenCreateForm(player.id)}>
                                          <b> {t('Copy')}</b>
                                        </Button>
                                      </Tooltip>
                                    ) : (
                                      <Button
                                        size="small"
                                        fullWidth
                                        disabled={!!user?.strategies.find((s) => s.player === player.id && s.isActive)}
                                        variant="contained"
                                        onClick={handleOpenCreateForm(player.id)}>
                                        <b>
                                          {user?.strategies.find((s) => s.player === player.id && s.isActive)
                                            ? t('Copied')
                                            : t('Copy')}
                                        </b>
                                      </Button>
                                    )}
                                  </Grid>
                                  <Grid item md={4}>
                                    <Button
                                      size="small"
                                      // disabled
                                      fullWidth
                                      variant="outlined"
                                      color="secondary"
                                      onClick={() => {
                                        handleDrawerToggle()
                                        handleDrawerSetPlayer(player.id)
                                      }}>
                                      {t('Details')}
                                    </Button>
                                  </Grid>
                                  {!user?.favorites?.find((f) => f.player === player.id) ? (
                                    <>
                                      <Grid item md={1}>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            handleToogleFavoritePlayer(player.id, {
                                              type: 'LIKE',
                                              isNeedToFavorite: true,
                                            })
                                          }}>
                                          <FavoriteBorderIcon fontSize="small" />
                                          {/* <ThumbUpOffAltIcon fontSize="small" /> */}
                                        </IconButton>
                                      </Grid>

                                      <Grid item md={1}>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            handleToogleFavoritePlayer(player.id, {
                                              type: 'DISLIKE',
                                              isNeedToFavorite: true,
                                            })
                                          }}>
                                          <ThumbDownOffAltIcon fontSize="small" />
                                        </IconButton>
                                      </Grid>
                                    </>
                                  ) : (
                                    <>
                                      <Grid item md={1}>
                                        {user?.favorites?.find((f) => f.player === player.id && f.type === 'LIKE') ? (
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                              handleToogleFavoritePlayer(player.id, {
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
                                              handleToogleFavoritePlayer(player.id, {
                                                type: 'DISLIKE',
                                                isNeedToFavorite: false,
                                              })
                                            }}>
                                            <ThumbDownIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Grid>
                                      <Grid item md={1}>
                                        <IconButton
                                          size="small"
                                          color="secondary"
                                          onClick={() => {
                                            handleDrawerToggle()
                                            handleDrawerSetPlayer(player.id)
                                          }}>
                                          <StickyNote2Icon fontSize="small" />
                                        </IconButton>
                                      </Grid>
                                    </>
                                  )}
                                </Grid>
                              </Box>
                            </>
                          )}
                        </Box>
                      </CardWrapper>
                    </Grid>
                  )
                })}
              </Grid>
              <Card
                sx={{
                  p: 2,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Box>
                  <Typography component="span" variant="subtitle1">
                    {t('Showing')}
                  </Typography>{' '}
                  <b>{limit}</b> {t('of')} <b>{players.length}</b> <b>{t('players')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={players.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage=""
                  rowsPerPageOptions={[5, 10, 15, 20]}
                />
              </Card>
            </>
          )}
        </>
      )}
      {!toggleView && (
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Typography
            align="center"
            variant="h4"
            fontWeight="normal"
            color="text.secondary"
            sx={{ my: 5 }}
            gutterBottom>
            {t('Choose between table or grid views for displaying the players list.')}
          </Typography>
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={5}>
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography align="center" sx={{ py: 4, px: 6 }} variant="h2">
            {t('Are you sure you want to permanently delete this player account')}?
          </Typography>

          <Box>
            <Button variant="text" size="large" sx={{ mx: 1 }} onClick={closeConfirmDelete}>
              {t('Cancel')}
            </Button>
            <ButtonError
              disabled
              onClick={handleDeleteCompleted}
              size="large"
              sx={{ mx: 1, px: 3 }}
              variant="contained">
              {t('Delete')}
            </ButtonError>
          </Box>
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

// PlayersList.defaultProps = {
//   user: {
//     strategies: {},
//   },
//   players: [],
//   fetching: true,
//   refreshQuery: {},
//   hasError: false,
// }

// PlayersList.propTypes = {
//   players: PropTypes.arrayOf(
//     PropTypes.shape({
//       bets: PropTypes.arrayOf(
//         PropTypes.shape({
//           createdAt: PropTypes.string.isRequired,
//         })
//       ),
//     })
//   ).isRequired,
//   user: PropTypes.shape({
//     strategies: PropTypes.arrayOf(
//       PropTypes.shape({
//         player: PropTypes.string.isRequired,
//       })
//     ).isRequired,
//   }).isRequired,
//   fetching: PropTypes.bool.isRequired,
//   refreshQuery: PropTypes.func.isRequired,
//   hasError: PropTypes.bool.isRequired,
// }

export default PlayersList
