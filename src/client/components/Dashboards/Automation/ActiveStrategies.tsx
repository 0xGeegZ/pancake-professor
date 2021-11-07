import 'moment-timezone'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDeleteStrategieMutation } from 'src/client/graphql/deleteStrategie.generated'
import { useToogleActivateStrategieMutation } from 'src/client/graphql/toogleActivateStrategie.generated'

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

const IconWrapper = styled(Box)(
  ({ theme }) => `
      padding: ${theme.spacing(2, 0)};
      color: ${theme.colors.primary.main};
      margin-left: -7px;
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

// const DotLegend = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     width: ${theme.spacing(1.5)};
//     height: ${theme.spacing(1.5)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// )
function ActiveStrategies({ strategies: pstrategies }) {
  const { t }: { t: any } = useTranslation()
  // const theme = useTheme()
  // const { mutate } = useGlobalStore()

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
  const [strategies, setStrategies] = useState<any[]>(pstrategies)

  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)

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
      // need to rollback
      return
    }

    // const updateds = strategies.map((s) => {
    //   const updated = s
    //   if (updated.id === strategie.id) updated.isActive = !updated.isActive

    //   return updated
    // })
    // setStrategies(updateds)
    enqueueSnackbar(t(`Stratégie successfully ${strategie.isActive ? 'activated' : 'desactivated'}.`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })
    // mutate('currentUser', (user) => {
    //   return { ...user, strategies: updateds }
    // })
  }

  useEffect(() => {
    if (!strategies) {
      setStrategies(null)
      return
    }

    setStrategies(
      pstrategies.sort((x, y) => {
        // true values first
        return x.isActive === y.isActive ? 0 : x.isActive ? -1 : 1
        // false values first
        // return (x.isActive === y.isActive)? 0 : x.isActive? 1 : -1;
      })
    )
  }, [pstrategies, strategies])

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

  const deleteStrategie = (strategie) => async () => {
    const updateds = strategies.map((s) => {
      const updated = s
      if (updated.id === strategie.id) updated.isDeleted = !updated.isDeleted

      return updated
    })
    setStrategies(updateds)

    const { error } = await deleteStrategieMutation({ id: strategie.id })

    if (error) {
      enqueueSnackbar(t(`Unexpected error during strategie deletion.`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      return
    }

    enqueueSnackbar(t(`Stratégie successfully deleted.`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })
  }

  return (
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
        {strategies?.length ? (
          <>
            {strategies.map((strategie) => (
              <Grid item xs={12} xl={3} md={4} sm={6} key={strategie.id}>
                <CardActiveStrategies
                  className={strategie.isError ? 'Mui-error' : strategie.isActive ? 'Mui-active' : ''}>
                  <CardActionArea>
                    <Switch
                      edge="end"
                      // defaultChecked={strategie?.isActive ? strategie.isActive : false}
                      checked={strategie.isActive}
                      color="primary"
                      disabled={strategie.isError}
                      onChange={handleChange(strategie)}
                    />
                    <Typography fontWeight="bold" variant="caption" color="primary">
                      {strategie.isError ? t('Error') : strategie.isActive ? t('Active') : t('Innactive')}
                    </Typography>
                    <Box sx={{ p: 1 }}>
                      <Grid spacing={2} container>
                        <Grid item xs={12} sm={3} alignItems="left">
                          <IconWrapper>
                            <AccountCircleIcon fontSize="large" />
                          </IconWrapper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Typography variant="h4" noWrap sx={{ pt: 3 }}>
                            {t('Player')}:{' '}
                            <Link variant="h5" href={`https://bscscan.com/address/${strategie.player}`} target="_blank">
                              {strategie.player.substring(0, 20)}
                            </Link>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ p: 1 }}>
                      <Grid spacing={2} container>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ pb: 1 }} component="div">
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
                              value={+strategie.winRate}
                              // color="primary"
                              color={
                                (+strategie.playsCount * 100) / strategie.roundsCount >= 30
                                  ? 'success'
                                  : (+strategie.playsCount * 100) / strategie.roundsCount >= 20
                                  ? 'warning'
                                  : 'error'
                              }
                              variant="determinate"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="caption" sx={{ pb: 1 }} component="div">
                            {t('% played')}
                          </Typography>
                          <Box>
                            <Typography
                              color="text.primary"
                              variant="h2"
                              sx={{ pr: 0.5, pt: 1, display: 'inline-flex' }}>
                              {parseInt(
                                `${
                                  strategie.roundsCount === 0
                                    ? 0
                                    : (+strategie.playsCount * 100) / strategie.roundsCount
                                }`,
                                10
                              )}
                              %
                            </Typography>
                            {/* <Typography color="text.secondary" variant="h4" sx={{ pr: 2, display: 'inline-flex' }}>
                              /100
                            </Typography> */}
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Typography variant="caption" sx={{ pb: 1.5, fontSize: '10px' }} component="div">
                            {t('Running since')}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Typography variant="h5" component="div">
                              {getStrategieDuraction(strategie)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardActionArea>
                  {!strategie.isActive && (
                    <>
                      <Divider />
                      <Box px={3} py={2}>
                        <Grid container spacing={3}>
                          <Grid item md={6}>
                            {/* <Tooltip placement="top" title={t('You need to be connected to copy player.')} arrow> */}
                            <Button
                              size="small"
                              fullWidth
                              variant="outlined"
                              color="error"
                              onClick={deleteStrategie(strategie)}>
                              <b> {t('Delete')}</b>
                            </Button>
                            {/* </Tooltip> */}
                          </Grid>
                          <Grid item md={6}>
                            <Button size="small" disabled fullWidth variant="outlined" color="secondary">
                              {t('Details')}
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  )}
                </CardActiveStrategies>
              </Grid>
            ))}
          </>
        ) : strategies === null ? (
          <Grid sx={{ py: 11 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item>
              <CircularProgress color="secondary" size="1rem" />
            </Grid>
          </Grid>
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
  )
}

ActiveStrategies.propTypes = {
  strategies: PropTypes.arrayOf(PropTypes.shape({})),
  // handleActive: PropTypes.func.isRequired,
}

ActiveStrategies.defaultProps = {
  strategies: [],
}

export default ActiveStrategies
