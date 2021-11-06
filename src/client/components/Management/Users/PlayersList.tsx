/* eslint-disable import/order */
import 'moment-timezone'

import { PREDICTION_CONTRACT_ABI } from '@/client/contracts/abis/pancake-prediction-abi-v3'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import GamepadIcon from '@mui/icons-material/Gamepad'
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone'
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
  Menu,
  MenuItem,
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
import Moment from 'react-moment'
import FollowPlayerForm from 'src/client/components/Dashboards/Automation/FollowPlayerForm'
import { useGlobalStore } from 'src/client/store/swr'
import loadPlayers from 'src/client/thegraph/loadPlayers'

import SidebarPlayerDrawer from './SidebarPlayerDrawer'

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

  const [fetching, setFetching] = useState<boolean>(false)
  const [players, setPlayers] = useState<any[]>([])
  const [hasError, setHasError] = useState<boolean>(false)
  const [preditionContract, setPreditionContract] = useState<any>(null)

  const { user, mutate, fetching: userFetching } = useGlobalStore()

  const getPlayers = useCallback(
    async (ppreditionContract) => {
      if (fetching) return

      console.log('getPlayers')

      setFetching(true)
      try {
        const lisPaused = await ppreditionContract.paused()
        if (lisPaused) {
          enqueueSnackbar(t(`Contract is paused.`), {
            variant: 'warning',
            TransitionComponent: Zoom,
          })
          return
        }
        const epoch = await ppreditionContract.currentEpoch()

        const lplayers = await loadPlayers({ epoch })
        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
      }
    },
    [fetching, enqueueSnackbar, t]
  )

  const refreshQuery = useCallback(
    async ({ orderBy }) => {
      console.log('refreshQuery')
      const epoch = await preditionContract.currentEpoch()

      setFetching(true)
      setPlayers([])
      players.length = 0

      try {
        const lplayers = await loadPlayers({ epoch, orderBy })
        setPlayers(lplayers)
        setFetching(false)
      } catch (err) {
        setHasError(true)
      }
    },
    [players, preditionContract]
  )

  useEffect(() => {
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

    const signer = lprovider.getSigner()

    const lpreditionContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
      signer
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
  const [orderBy, setOrderBy] = useState<string>(ordersBy[1].text)

  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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
                {orderBy}
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
                    onClick={async () => {
                      setOrderBy(_order.text)
                      setOpenMenuOrderBy(false)
                      await refreshQuery({ orderBy: _order.value })
                    }}>
                    {_order.text}
                  </MenuItem>
                ))}
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
            fetching ? (
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
                      {paginatedPlayers[0]?.recentGames ? <TableCell>{t('Last 24h')}</TableCell> : <></>}
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
                          {player.recentGames ? (
                            <>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <DotLegend
                                    style={{
                                      background:
                                        (+player.recentGames * 100) / 288 >= 30
                                          ? theme.colors.success.main
                                          : (+player.recentGames * 100) / 288 >= 20
                                          ? theme.colors.warning.main
                                          : theme.colors.error.main,
                                    }}
                                  />
                                  <Box>
                                    {player.recentGames}/288 ({parseInt(`${(+player.recentGames * 100) / 288}`, 10)} %)
                                  </Box>
                                </Box>
                              </TableCell>
                            </>
                          ) : (
                            <></>
                          )}
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {!player.recentGames ? (
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
                              ) : (
                                <></>
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
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
      {toggleView === 'grid_view' && (
        <>
          {paginatedPlayers.length === 0 ? (
            fetching ? (
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
                                <Box sx={{ p: 4 }}>
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
                                      <Moment local>{moment(+player.bets[0].createdAt * 1000)}</Moment>
                                    </Typography>
                                  )}
                                </Box>
                                {player.recentGames ? (
                                  <>
                                    <Divider />
                                    <Box sx={{ pr: 2, pl: 2, pt: 1, pb: 1 }}>
                                      <Grid spacing={2} container>
                                        <Grid item xs={12} sm={4}>
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
                                        <Grid item xs={12} sm={4}>
                                          <Typography variant="caption" sx={{ pb: 1.5 }} component="div">
                                            {t('Total Bets')}
                                          </Typography>
                                          <Box display="flex" alignItems="center">
                                            <DotLegend
                                              style={{
                                                background:
                                                  +player.totalBets > 250
                                                    ? theme.colors.success.main
                                                    : +player.totalBets > 100
                                                    ? theme.colors.warning.main
                                                    : theme.colors.error.main,
                                              }}
                                            />
                                            <Typography variant="h3" sx={{ pl: 1 }} component="div">
                                              {player.totalBets}
                                            </Typography>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                          <Typography variant="caption" sx={{ pb: 1 }} component="div">
                                            {t('Last 24h')}(%)
                                          </Typography>
                                          <Box>
                                            <Typography
                                              color="text.primary"
                                              variant="h2"
                                              sx={{ pr: 0.5, display: 'inline-flex' }}>
                                              {parseInt(`${(+player.recentGames * 100) / 288}`, 10)}
                                            </Typography>
                                            <Typography
                                              color="text.secondary"
                                              variant="h4"
                                              sx={{ pr: 2, display: 'inline-flex' }}>
                                              /100
                                            </Typography>
                                            <LinearProgressWrapper
                                              value={(player.recentGames * 100) / 288}
                                              color={
                                                (player.recentGames * 100) / 288 >= 30
                                                  ? 'success'
                                                  : (player.recentGames * 100) / 288 >= 20
                                                  ? 'warning'
                                                  : 'error'
                                              }
                                              variant="determinate"
                                            />
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </>
                                ) : (
                                  <>
                                    <Divider />
                                    <Box sx={{ p: 2 }}>
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
                                      </Grid>
                                    </Box>
                                  </>
                                )}
                              </Box>

                              <Divider />
                              <Box px={3} py={2}>
                                <Grid container spacing={3}>
                                  <Grid item md={6}>
                                    {!user ? (
                                      <Tooltip
                                        placement="top"
                                        title={t('You need to be connected to copy player.')}
                                        arrow>
                                        <Button size="small" fullWidth variant="outlined" color="warning">
                                          <b> {t('Copy')}</b>
                                        </Button>
                                      </Tooltip>
                                    ) : (
                                      <Button
                                        size="small"
                                        fullWidth
                                        disabled={!!user?.strategies.find((s) => s.player === player.id)}
                                        variant="contained"
                                        onClick={handleOpenCreateForm(player.id)}>
                                        <b>
                                          {user?.strategies.find((s) => s.player === player.id)
                                            ? t('Copied')
                                            : t('Copy')}
                                        </b>
                                      </Button>
                                    )}
                                  </Grid>
                                  <Grid item md={6}>
                                    <Button
                                      size="small"
                                      disabled
                                      fullWidth
                                      variant="outlined"
                                      color="secondary"
                                      onClick={handleDrawerToggle}>
                                      {t('View details')}
                                    </Button>
                                  </Grid>
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
                  rowsPerPageOptions={[5, 10, 15]}
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
        {mobileOpen && <SidebarPlayerDrawer />}
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
