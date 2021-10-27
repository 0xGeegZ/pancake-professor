import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
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
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

function ActiveStrategies() {
  const { t }: { t: any } = useTranslation()
  // const { user } = useAuth();

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
  const actionRef = useRef<any>(null)
  const [openLocation, setOpenMenuLocation] = useState<boolean>(false)

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
        <Grid item xs={12} xl={3} md={4} sm={6}>
          <CardActiveStrategies>
            <CardActionArea>
              <Switch edge="end" color="primary" />
              <Typography fontWeight="bold" variant="caption" color="primary">
                {t('innactive')}
              </Typography>
              <IconWrapper>
                <AccountCircleIcon fontSize="large" />
              </IconWrapper>
              <Typography variant="h4" noWrap>
                {t('Address')}
              </Typography>
            </CardActionArea>
          </CardActiveStrategies>
        </Grid>
        <Grid item xs={12} xl={3} md={4} sm={6}>
          <CardActiveStrategies className="Mui-active">
            <CardActionArea>
              <Switch edge="end" defaultChecked color="primary" />
              <Typography fontWeight="bold" variant="caption" color="primary">
                {t('active')}
              </Typography>
              <IconWrapper>
                <AccountCircleIcon fontSize="large" />
              </IconWrapper>
              <Typography variant="h4" noWrap>
                {t('Address')}
              </Typography>
            </CardActionArea>
          </CardActiveStrategies>
        </Grid>
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

export default ActiveStrategies
