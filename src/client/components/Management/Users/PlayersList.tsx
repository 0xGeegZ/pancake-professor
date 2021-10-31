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
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import {
  ChangeEvent,
  FC,
  forwardRef,
  MouseEvent,
  Ref,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import FollowPlayerForm from 'src/client/components/Dashboards/Automation/FollowPlayerForm'

import SidebarPlayerDrawer from './SidebarPlayerDrawer'

/* eslint-disable react/jsx-props-no-spreading */
import type { Player } from 'src/client/models/player'

import type { ReactElement } from 'react'
// import type { Player, PlayerRole } from 'src/client/models/player'
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

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
`
)

const AvatarWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.main};
      color:  ${theme.palette.primary.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.warning};
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

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
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

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `

    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
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

interface PlayersListProps {
  players: Player[]
  fetching: boolean
  refreshQuery: any
  hasError: boolean
}

// interface Filters {
//   role?: PlayerRole
// }

// eslint-disable-next-line react/display-name
// eslint-disable-next-line react/require-default-props
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))

// const getPlayerRoleLabel = (playerRole: PlayerRole): JSX.Element => {
//   const map = {
//     admin: {
//       text: 'Administrator',
//       color: 'error',
//     },
//     customer: {
//       text: 'Customer',
//       color: 'info',
//     },
//     subscriber: {
//       text: 'Waiting List',
//       color: 'warning',
//     },
//   }

//   const { text, color }: any = map[playerRole]

//   return <Label color={color}>{text}</Label>
// }

const applyFilters = (players: Player[], query: string, filters: Filters): Player[] =>
  players.filter((player) => {
    let matches = true

    if (query) {
      const properties = ['email', 'name', 'address', 'generated']
      // const properties = ['email', 'name', 'playername']
      let containsQuery = false

      properties.forEach((property) => {
        if (player[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true
        }
      })

      // if (filters.role && player.role !== filters.role) {
      //   matches = false
      // }

      if (!containsQuery) {
        matches = false
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key]

      if (value && player[key] !== value) {
        matches = false
      }
    })

    return matches
  })

const applyPagination = (players: Player[], page: number, limit: number): Player[] =>
  players.slice(page * limit, page * limit + limit)

const PlayersList: FC<PlayersListProps> = ({ refreshQuery, players, fetching, hasError }) => {
  const { t }: { t: any } = useTranslation()
  const theme = useTheme()

  // const [, createStrategie] = useCreateStrategieMutation()

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

  const [selectedItems, setSelectedPlayers] = useState<string[]>([])
  const { enqueueSnackbar } = useSnackbar()

  const tabs = [
    {
      value: 'all',
      label: t('All players'),
    },
    // {
    //   value: 'customer',
    //   label: t('Customers'),
    // },
    // {
    //   value: 'admin',
    //   label: t('Administrators'),
    // },
    // {
    //   value: 'subscriber',
    //   label: t('Waiting List'),
    // },
  ]

  const [page, setPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [query, setQuery] = useState<string>('')
  const [filters, setFilters] = useState<Filters>({
    role: null,
  })

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: unknown) => {
    let value = null

    if (tabsValue !== 'all') {
      value = tabsValue
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
    }))

    setSelectedPlayers([])
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist()
    setQuery(event.target.value)
  }

  const handleSelectAllPlayers = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedPlayers(event.target.checked ? players.map((player) => player.id) : [])
  }

  const handleSelectOnePlayer = (_event: ChangeEvent<HTMLInputElement>, playerId: string): void => {
    if (!selectedItems.includes(playerId)) {
      setSelectedPlayers((prevSelected) => [...prevSelected, playerId])
    } else {
      setSelectedPlayers((prevSelected) => prevSelected.filter((id) => id !== playerId))
    }
  }

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage)
  }

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value))
  }

  // const updateQuery = useCallback(async () => {
  //   try {
  //     await refreshQuery({ orderBy })
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }, [])

  const filteredPlayers = applyFilters(players, query, filters)
  const paginatedPlayers = applyPagination(filteredPlayers, page, limit)
  const selectedBulkActions = selectedItems.length > 0
  const selectedSomePlayers = selectedItems.length > 0 && selectedItems.length < players.length
  const selectedAllPlayers = selectedItems.length === players.length

  // useEffect(() => {
  //   console.log('🚀 ~ Player list effect')
  // })

  const [toggleView, setToggleView] = useState<string | null>('grid_view')

  const handleViewOrientation = (_event: MouseEvent<HTMLElement>, newValue: string | null) => {
    setToggleView(newValue)
  }

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true)
  }

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
  const [activePlayer, setActivePlayer] = useState(null)

  const handleOpenCreateForm = (pactivePlayer) => {
    setOpenCreateForm(true)
    setActivePlayer(pactivePlayer)
  }

  const handleCloseCreateForm = () => {
    setOpenCreateForm(false)
    setActivePlayer(null)
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}>
        {/* <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={filters.role || 'all'}
          variant="scrollable">
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsWrapper> */}
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
          {/* <Box p={2}>
            {!selectedBulkActions && (
              <TextField
                sx={{ m: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleQueryChange}
                placeholder={t('Search by name, email or address...')}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
            {selectedBulkActions && <BulkActions />}
          </Box> */}

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
                      const isPlayerSelected = selectedItems.includes(player.id)
                      return (
                        <TableRow hover key={player.id} selected={isPlayerSelected}>
                          {player.recentGames ? (
                            <>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <DotLegend
                                    style={{
                                      background:
                                        parseInt((player.recentGames * 100) / 288) >= 30
                                          ? theme.colors.success.main
                                          : parseInt((player.recentGames * 100) / 288) >= 20
                                          ? theme.colors.warning.main
                                          : theme.colors.error.main,
                                    }}
                                  />
                                  <Box>
                                    {player.recentGames}/288 ({parseInt((player.recentGames * 100) / 288)} %)
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
                              <Box>
                                {parseFloat(player.winRate).toFixed(2)}%{/* </Link> */}
                              </Box>
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
                              <Tooltip title={t('Copy')} arrow>
                                <IconButton component={Link} onClick={handleOpenCreateForm(player.id)} color="primary">
                                  <GamepadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
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
                  count={filteredPlayers.length}
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
          {/* {!fetching && paginatedPlayers.length !== 0 ? (
            <Card sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                {/* {paginatedPlayers.length !== 0 && ( */}
          {/* <>
                  <Box display="flex" alignItems="center">
                    <Tooltip arrow placement="top" title={t('Select all players')}>
                      <Checkbox
                        checked={selectedAllPlayers}
                        indeterminate={selectedSomePlayers}
                        onChange={handleSelectAllPlayers}
                      />
                    </Tooltip>
                  </Box>
                  {selectedBulkActions && (
                    <Box flex={1} pl={2}>
                      <BulkActions />
                    </Box>
                  )}
                </> */}
          {/* // )} */}
          {/* {!selectedBulkActions && (
                <TextField
                  sx={{ my: 0, ml: paginatedPlayers.length !== 0 ? 2 : 0 }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleQueryChange}
                  placeholder={t('Search by name, email or address...')}
                  value={query}
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              )} */}
          {/* </Box>
            </Card>
          ) : (
            <></> 
          )} */}
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
                  const isPlayerSelected = selectedItems.includes(player.id)

                  return (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isPlayerSelected,
                        })}>
                        <Box sx={{ position: 'relative', zIndex: '2' }}>
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
                                          {parseInt(player.winRate)}
                                        </Typography>
                                        <Typography
                                          color="text.secondary"
                                          variant="h4"
                                          sx={{ pr: 2, display: 'inline-flex' }}>
                                          /100
                                        </Typography>
                                        <LinearProgressWrapper
                                          value={parseInt(player.winRate)}
                                          // color="primary"
                                          color={
                                            (parseInt(player.winRate) * 100) / 100 >= 60
                                              ? 'success'
                                              : (parseInt(player.winRate) * 100) / 100 >= 55
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
                                        {/* <AvatarPrimary> */}
                                        {/* <WorkTwoToneIcon /> */}
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
                                        {/* </AvatarPrimary> */}
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
                                          {parseInt((player.recentGames * 100) / 288)}
                                        </Typography>
                                        <Typography
                                          color="text.secondary"
                                          variant="h4"
                                          sx={{ pr: 2, display: 'inline-flex' }}>
                                          /100
                                        </Typography>
                                        <LinearProgressWrapper
                                          value={(player.recentGames * 100) / 288}
                                          // color="primary"
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
                                          {parseInt(player.winRate)}
                                        </Typography>
                                        <Typography
                                          color="text.secondary"
                                          variant="h4"
                                          sx={{ pr: 2, display: 'inline-flex' }}>
                                          /100
                                        </Typography>
                                        <LinearProgressWrapper
                                          value={parseInt(player.winRate)}
                                          // color="primary"
                                          color={
                                            (parseInt(player.winRate) * 100) / 100 >= 60
                                              ? 'success'
                                              : (parseInt(player.winRate) * 100) / 100 >= 55
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
                                        {/* <AvatarPrimary> */}
                                        {/* <WorkTwoToneIcon /> */}
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
                                        {/* </AvatarPrimary> */}
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
                                {/* <Button size="small" fullWidth variant="contained"> */}
                                <Button
                                  size="small"
                                  fullWidth
                                  variant="contained"
                                  onClick={handleOpenCreateForm(player.id)}>
                                  <b> {t('Copy')}</b>
                                </Button>
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
                          {openCreateForm && activePlayer === player.id ? (
                            <>
                              <Divider />
                              <FollowPlayerForm />
                              {/* <FollowPlayerForm handleCloseCreateForm={handleCloseCreateForm} player={player} /> */}
                            </>
                          ) : (
                            <></>
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
                  <b>{limit}</b> {t('of')} <b>{filteredPlayers.length}</b> <b>{t('players')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredPlayers.length}
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

// PlayersList.propTypes = {
//   players: PropTypes.array,
//   fetching: PropTypes.bool.isRequired,
//   refreshQuery: PropTypes.func.isRequired,
//   hasError: PropTypes.bool.isRequired,
// }

// PlayersList.defaultProps = {
//   players: [],
//   fetching: true,
//   refreshQuery: {},
//   hasError: false,
// }

export default PlayersList
