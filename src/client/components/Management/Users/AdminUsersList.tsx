import CloseIcon from '@mui/icons-material/Close'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Slide,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TransitionProps } from '@mui/material/transitions'
import clsx from 'clsx'
import { formatDistance } from 'date-fns'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { ChangeEvent, FC, forwardRef, MouseEvent, Ref, SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ReactElement } from 'react'

import type { User, UserRole } from 'src/client/models/user'
import BulkActions from './BulkActions'

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
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
interface ResultsProps {
  users: User[]
  fetching: boolean
}

interface Filters {
  role?: UserRole
}

/* eslint-disable */
const Transition = forwardRef((props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) => (
  <Slide direction="down" ref={ref} {...props} />
))
/* eslint-enable */

// const getUserRoleLabel = (userRole: UserRole): JSX.Element => {
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

//   const { text, color }: any = map[userRole]

//   return <Label color={color}>{text}</Label>
// }

const applyFilters = (users: User[], query: string, filters: Filters): User[] =>
  users.filter((user) => {
    let matches = true

    if (query) {
      const properties = ['email', 'name', 'address', 'generated']
      // const properties = ['email', 'name', 'username']
      let containsQuery = false

      properties.forEach((property) => {
        if (user[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true
        }
      })

      // if (filters.role && user?.role !== filters.role) {
      //   matches = false
      // }

      if (!containsQuery) {
        matches = false
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key]

      if (value && user[key] !== value) {
        matches = false
      }
    })

    return matches
  })

const applyPagination = (users: User[], page: number, limit: number): User[] =>
  users.slice(page * limit, page * limit + limit)

const AdminUsersList: FC<ResultsProps> = ({ users, fetching }) => {
  const [selectedItems, setSelectedUsers] = useState<string[]>([])
  const { t }: { t: any } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const tabs = [
    {
      value: 'all',
      label: t('All users'),
    },
    // {
    //   value: 'activateds',
    //   label: t('Activateds'),
    // },
    // {
    //   value: 'unactivateds',
    //   label: t('Unactivated'),
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

    setSelectedUsers([])
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist()
    setQuery(event.target.value)
  }

  const handleSelectAllUsers = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedUsers(event.target.checked ? users.map((user) => user?.id) : [])
  }

  const handleSelectOneUser = (_event: ChangeEvent<HTMLInputElement>, userId: string): void => {
    if (!selectedItems.includes(userId)) {
      setSelectedUsers((prevSelected) => [...prevSelected, userId])
    } else {
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId))
    }
  }

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage)
  }

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(+event.target.value)
  }

  const filteredUsers = applyFilters(users, query, filters)
  const paginatedUsers = applyPagination(filteredUsers, page, limit)
  const selectedBulkActions = selectedItems.length > 0
  const selectedSomeUsers = selectedItems.length > 0 && selectedItems.length < users.length
  const selectedAllUsers = selectedItems.length === users.length

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

    enqueueSnackbar(t('The user account has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    })
  }

  const handleActivate = (user) => () => {
    console.log('handleActivate', user)
    // TODO
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}>
        <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={filters.role || 'all'}
          variant="scrollable">
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsWrapper>
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
          <Box p={2}>
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
          </Box>

          <Divider />

          {paginatedUsers.length === 0 ? (
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
                    {/* TODO UPDATE PROGRESS COLOR TO WHITE */}
                    <CircularProgress color="secondary" size="1rem" />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
                  {t("We couldn't find any users matching your search criteria")}
                </Typography>
              </>
            )
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllUsers}
                          indeterminate={selectedSomeUsers}
                          onChange={handleSelectAllUsers}
                        />
                      </TableCell>
                      {/* <TableCell>{t('Username')}</TableCell> */}
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Email')}</TableCell>
                      <TableCell>{t('Main address')}</TableCell>
                      <TableCell>{t('Generated address')}</TableCell>
                      <TableCell align="center">{t('Status')}</TableCell>
                      {/* <TableCell align="center">{t('Posts')}</TableCell>
                      <TableCell>{t('Location')}</TableCell> */}
                      {/* <TableCell>{t('Role')}</TableCell> */}
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => {
                      const isUserSelected = selectedItems.includes(user?.id)
                      return (
                        <TableRow hover key={user?.id} selected={isUserSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isUserSelected}
                              onChange={(event) => handleSelectOneUser(event, user?.id)}
                              value={isUserSelected}
                            />
                          </TableCell>
                          {/* <TableCell>
                            <Typography variant="h5">{user?.username}</Typography>
                          </TableCell> */}
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {/* <Avatar sx={{ mr: 1 }} src="/static/images/avatars/1.jpg" /> */}
                              <Box>
                                <Link underline="hover" variant="h5" href={`/admin/users/${user?.id}`}>
                                  {user?.name}
                                </Link>
                                {/* <Typography noWrap variant="subtitle2">
                                  {user?.jobtitle}
                                </Typography> */}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography>{user?.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Link
                              underline="hover"
                              variant="h5"
                              href={`https://bscscan.com/address/${user?.address}`}
                              target="_blank">
                              <Typography fontWeight="bold">{user?.address.substring(0, 15)}</Typography>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <TableCell>
                              <Link
                                underline="hover"
                                variant="h5"
                                href={`https://bscscan.com/address/${user?.generated}`}
                                target="_blank">
                                <Typography fontWeight="bold">{user?.generated.substring(0, 15)}</Typography>
                              </Link>
                            </TableCell>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              sx={{ m: 1 }}
                              key="isActive"
                              color={user?.isActivated ? 'success' : 'error'}
                              variant={user?.isActivated ? 'filled' : 'outlined'}
                              label={user?.isActivated ? ' Active' : 'Unactive'}
                              onClick={handleActivate(user)}
                            />
                            {/* {user.isDeleted ? (<Chip
                                  sx={{ m: 1 }}
                                  key="isDeleted"
                                  variant="outlined"
                                  label={"Deleted"} 
                                />) : <></>}  */}
                          </TableCell>
                          {/* <TableCell align="center">
                            <Typography fontWeight="bold">{user?.posts}</Typography>
                          </TableCell>
                          <TableCell> */}
                          {/* <Typography>{user?.location}</Typography>
                          </TableCell> */}
                          {/* <TableCell>{getUserRoleLabel(user?.role)}</TableCell> */}
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('View')} arrow>
                                <IconButton disabled component={Link} href={`/admin/users/${user?.id}`} color="primary">
                                  <LaunchTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton disabled onClick={handleConfirmDelete} color="primary">
                                  <DeleteTwoToneIcon fontSize="small" />
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
                  count={filteredUsers.length}
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
          <Card sx={{ p: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              {paginatedUsers.length !== 0 && (
                <>
                  <Box display="flex" alignItems="center">
                    <Tooltip arrow placement="top" title={t('Select all users')}>
                      <Checkbox
                        checked={selectedAllUsers}
                        indeterminate={selectedSomeUsers}
                        onChange={handleSelectAllUsers}
                      />
                    </Tooltip>
                  </Box>
                  {selectedBulkActions && (
                    <Box flex={1} pl={2}>
                      <BulkActions />
                    </Box>
                  )}
                </>
              )}
              {!selectedBulkActions && (
                <TextField
                  sx={{ my: 0, ml: paginatedUsers.length !== 0 ? 2 : 0 }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleQueryChange}
                  placeholder={t('Search by name or address...')}
                  value={query}
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              )}
            </Box>
          </Card>
          {paginatedUsers.length === 0 ? (
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
            ) : (
              <Typography sx={{ py: 10 }} variant="h3" fontWeight="normal" color="text.secondary" align="center">
                {t("We couldn't find any users matching your search criteria")}
              </Typography>
            )
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedUsers.map((user) => {
                  const isUserSelected = selectedItems.includes(user?.id)

                  return (
                    <Grid item xs={12} sm={6} md={4} key={user?.id}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isUserSelected,
                        })}>
                        <Box sx={{ position: 'relative', zIndex: '2' }}>
                          {/* <Box px={2} pt={2} display="flex" alignItems="flex-start" justifyContent="space-between">
                            {getUserRoleLabel(user?.role)}
                            <IconButton color="primary" sx={{ p: 0.5 }}>
                              <MoreVertTwoToneIcon />
                            </IconButton>
                          </Box> */}
                          <Box p={2} display="flex" alignItems="flex-start">
                            {/* <Avatar sx={{ width: 50, height: 50, mr: 2 }} src="/static/images/avatars/1.jpg" /> */}
                            <Box>
                              <Box>
                                <Link underline="hover" variant="h5" href={`/admin/users/${user?.id}`}>
                                  {user?.name}
                                </Link>
                                <Typography sx={{ pt: 1 }} variant="h6">
                                  {user?.email}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {t('Main address')} :{' '}
                                  <Link
                                    underline="hover"
                                    variant="h5"
                                    href={`https://bscscan.com/address/${user?.address}`}
                                    target="_blank">
                                    {user?.address.substring(0, 15)}
                                  </Link>
                                </Typography>
                              </Box>
                              <Box>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {t('Generated address')} :{' '}
                                  <Link
                                    underline="hover"
                                    variant="h5"
                                    href={`https://bscscan.com/address/${user?.generated}`}
                                    target="_blank">
                                    {user?.generated.substring(0, 15)}
                                  </Link>
                                </Typography>
                              </Box>
                              <Box pt={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                  {t('Last login')} :{' '}
                                  {formatDistance(user?.loginAt ? new Date(user?.loginAt) : new Date(), new Date(), {
                                    addSuffix: true,
                                  })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {t('Registered')} :{' '}
                                  {formatDistance(
                                    user?.registeredAt ? new Date(user?.registeredAt) : new Date(),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </Typography>
                              </Box>

                              <Box pt={1}>
                                <Chip
                                  sx={{ m: 1 }}
                                  key="isActive"
                                  color={user?.isActivated ? 'success' : 'error'}
                                  variant={user?.isActivated ? 'filled' : 'outlined'}
                                  label={user?.isActivated ? ' Active' : 'Unactive'}
                                  onClick={handleActivate(user)}
                                />
                                {/* {user.isDeleted ? (<Chip
                                  sx={{ m: 1 }}
                                  key="isDeleted"
                                  variant="outlined"
                                  label={"Deleted"} 
                                />) : <></>}  */}
                              </Box>
                            </Box>
                          </Box>
                          <Divider />
                          <Box pl={2} py={1} pr={1} display="flex" alignItems="center" justifyContent="space-between">
                            <Typography>
                              {/* <b>{user?.posts}</b> {t('posts')} */}
                              <b> {t('Select')}</b>
                            </Typography>
                            <Checkbox
                              checked={isUserSelected}
                              onChange={(event) => handleSelectOneUser(event, user?.id)}
                              value={isUserSelected}
                            />
                          </Box>
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
                  <b>{limit}</b> {t('of')} <b>{filteredUsers.length}</b> <b>{t('users')}</b>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredUsers.length}
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
            {t('Choose between table or grid views for displaying the users list.')}
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
            {t('Are you sure you want to permanently delete this user account')}?
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
    </>
  )
}

AdminUsersList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  users: PropTypes.array,
  fetching: PropTypes.bool.isRequired,
}

AdminUsersList.defaultProps = {
  users: [],
  // fetching: true,
}

export default AdminUsersList
