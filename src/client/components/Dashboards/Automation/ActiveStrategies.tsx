import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone'
import { useSnackbar } from 'notistack'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Link,
  CircularProgress,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDesactivateStrategieMutation } from 'src/client/graphql/desactivateStrategie.generated'

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
        background: ${theme.palette.primary.main};
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

function ActiveStrategies({ strategies: pstrategies }) {
  const { t }: { t: any } = useTranslation()

  const [, desactivateStrategie] = useDesactivateStrategieMutation()
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
      value: 'stopped',
      text: t('Stopped strategie'),
    },
  ]

  const [location, setLocation] = useState<string>(locations[0].text)
  const [strategies, setStrategies] = useState<any[]>(pstrategies)

  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)

  const handleChange = (strategie) => async () => {
    const { error } = await desactivateStrategie({ id: strategie.id })

    if (error) {
      enqueueSnackbar(t(`Unexpected error during strategie ${strategie.isActive ? 'activation' : 'desactivation'}.`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
      return
    }

    const updateds = strategies.map((s) => {
      const updated = s
      if (updated.id === strategie.id) updated.isActive = !updated.isActive

      return updated
    })
    setStrategies(updateds)
    enqueueSnackbar(t(`Stratégie successfully ${strategie.isActive ? 'activated' : 'desactivated'}.`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })
  }

  useEffect(() => {
    if (!strategies) return

    setStrategies(pstrategies)
  }, [pstrategies, strategies])

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
                <CardActiveStrategies className={strategie.isActive ? 'Mui-active' : ''}>
                  <CardActionArea>
                    <Switch
                      edge="end"
                      // defaultChecked={strategie?.isActive ? strategie.isActive : false}
                      checked={strategie.isActive}
                      color="primary"
                      onChange={handleChange(strategie)}
                    />
                    <Typography fontWeight="bold" variant="caption" color="primary">
                      {strategie.isActive ? t('Active') : t('Innactive')}
                    </Typography>
                    <IconWrapper>
                      <AccountCircleIcon fontSize="large" />
                    </IconWrapper>
                    <Typography variant="h4" noWrap>
                      {t('Player')}:{' '}
                      <Link variant="h5" href={`https://bscscan.com/address/${strategie.player}`} target="_blank">
                        {strategie.player.substring(2, 12)}
                      </Link>
                    </Typography>
                  </CardActionArea>
                </CardActiveStrategies>
              </Grid>
            ))}
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
          </>
        ) : (
          <Grid sx={{ py: 11 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item>
              <CircularProgress color="secondary" size="1rem" />
            </Grid>
          </Grid>
        )}
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
