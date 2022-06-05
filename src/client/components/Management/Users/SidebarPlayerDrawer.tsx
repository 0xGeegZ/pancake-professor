import TrendingDown from '@mui/icons-material/TrendingDown'
import TrendingUp from '@mui/icons-material/TrendingUp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import AssessmentIcon from '@mui/icons-material/Assessment'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  lighten,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone'
import GradeTwoToneIcon from '@mui/icons-material/GradeTwoTone'
import OpenInNewTwoToneIcon from '@mui/icons-material/OpenInNewTwoTone'
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone'
import ReportTwoToneIcon from '@mui/icons-material/ReportTwoTone'
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone'
import TextSnippetTwoToneIcon from '@mui/icons-material/TextSnippetTwoTone'
import { styled } from '@mui/material/styles'
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'
import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import Link from 'src/client/components/Link'
import Text from 'src/client/components/Text'
import useRefMounted from 'src/client/hooks/useRefMounted'
import loadPlayer from 'src/client/thegraph/loadPlayer'

// const AvatarPrimary = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.primary.lighter};
//     color: ${theme.colors.primary.main};
//     width: ${theme.spacing(8)};
//     height: ${theme.spacing(8)};
// `
// )

const ListSubheaderLarge = styled(ListSubheader)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
    color: ${theme.colors.alpha.black[100]};
    font-size: ${theme.typography.pxToRem(19)};
    line-height: ${theme.spacing(6)};
`
)

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.primary.main};
    color: ${theme.colors.alpha.trueWhite[70]};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    margin: ${theme.spacing(1)};

    &:hover {
        background: ${lighten(theme.colors.primary.main, 0.2)};
        color: ${theme.colors.alpha.trueWhite[100]};
    }
`
)

const ListItemIconWrapper = styled(ListItemIcon)(
  ({ theme }) => `
    min-width: 36px;
    color: ${theme.colors.primary.light};
  `
)

const AccordionSummaryWrapper = styled(AccordionSummary)(
  ({ theme }) => `
    &.Mui-expanded {
      min-height: 48px;
    }

    .MuiAccordionSummary-content.Mui-expanded {
      margin: 12px 0;
    }

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
    }

    &.MuiButtonBase-root {

      margin-bottom: ${theme.spacing(0.5)};

      &:last-child {
        margin-bottom: 0;
      }

      &.Mui-expanded,
      &:hover {
        background: ${theme.colors.alpha.black[10]};

        .MuiSvgIcon-root {
          color: ${theme.colors.primary.main};
        }
      }
    }
`
)

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
        background-color: ${theme.colors.alpha.black[5]};

        .MuiTabs-flexContainer {
            justify-content: center;
        }
  `
)

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
`
)

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
)

// const AvatarWrapperWarning = styled(Avatar)(
//   ({ theme }) => `
//       background-color: ${theme.colors.warning.lighter};
//       color:  ${theme.colors.warning.main};
// `
// )

function SidebarPlayerDrawer({ playerId }) {
  const { t }: { t: any } = useTranslation()
  const isMountedRef = useRefMounted()

  const [expanded, setExpanded] = useState<string | false>('section1')
  const [history, setHistory] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const handleChange = (section: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? section : false)
  }

  const [currentTab, setCurrentTab] = useState<string>('details')

  const tabs = [
    { value: 'details', label: t('Details') },
    { value: 'activity', label: t('Activity') },
  ]

  const handleTabsChange = (_event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value)
  }

  const loadUserHistory = useCallback(async () => {
    try {
      if (isMountedRef.current) {
        const loadedHistory = await loadPlayer(playerId)

        if (!loadedHistory) return

        setHistory(loadedHistory)
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }, [isMountedRef, playerId])

  useEffect(() => {
    loadUserHistory()
  }, [loadUserHistory])

  const getWinLossRate = (bet) => {
    if (bet.position === 'Bull') return (1 + bet.round.bullAmount / bet.round.bearAmount).toFixed(2)

    return (1 + bet.round.bearAmount / bet.round.bullAmount).toFixed(2)
  }

  const getWinLossAmount = (bet) => {
    if (bet.position !== bet.round.position) return parseFloat(bet.amount).toFixed(4)

    const rate = getWinLossRate(bet)

    return (bet.amount * +rate).toFixed(4)
  }

  return (
    <Box sx={{ width: { xs: 340, lg: 400 } }}>
      <Box sx={{ textAlign: 'center' }}>
        {/* <AvatarPrimary
          sx={{
            mx: 'auto',
            my: 3,
          }}
          variant="rounded">
          <AssignmentIndIcon fontSize="large" />
        </AvatarPrimary> */}
        <Typography
          sx={{
            mx: 'auto',
            my: 3,
          }}
          variant="h2"
          noWrap
          gutterBottom>
          <Link href={`https://bscscan.com/address/${playerId}`} target="_blank">
            {playerId.substring(0, 10)}
          </Link>
        </Typography>
        {/* <Typography component="span" variant="subtitle2">
          {t('Last playe')}{' '}
          {formatDistance(subDays(new Date(), 1), new Date(), {
            addSuffix: true,
          })}{' '}
          {t('by')}{' '}
        </Typography> */}
      </Box>

      {/* <Divider sx={{ my: 3 }} /> */}
      <Box px={3}>
        <Box mb={3} display="flex" justifyContent="center">
          <Tooltip arrow placement="top" title={t('Favorite current player')}>
            <IconButton
              size="small"
              color="error"
              disabled
              // onClick={() => {
              //   handleToogleFavoritePlayer(activeStrategie?.player, true)
              // }}
            >
              {/* <FavoriteBorderIcon fontSize="small" /> */}
              <FavoriteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            color="secondary"
            disabled
            // onClick={() => {
            //   handleDrawerToggle()
            //   handleDrawerSetPlayer(player.id)
            // }}
          >
            <StickyNote2Icon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="secondary">
            <Link href={`/app/player/${playerId}`} variant="body2" underline="hover">
              <AssessmentIcon fontSize="small" />
            </Link>
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />

      {loading ? (
        <>
          <Box height={200}>
            <Grid sx={{ py: 10 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item>
                <CircularProgress color="secondary" size="1rem" />
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <TabsContainerWrapper>
            <Tabs
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary">
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </TabsContainerWrapper>
          {currentTab === 'details' && (
            <>
              {/* <Box mt={3} px={3}>
            <Typography variant="h3">{t('Followed by')}</Typography>
            <Box mt={2} display="flex">
              <AvatarGroup max={6}>
                <Tooltip arrow title="Remy Sharp">
                  <Avatar component={Link} href="#" alt="Remy Sharp" src="/static/images/avatars/1.jpg" />
                </Tooltip>
                <Tooltip arrow title="Travis Howard">
                  <Avatar component={Link} href="#" alt="Travis Howard" src="/static/images/avatars/2.jpg" />
                </Tooltip>
                <Tooltip arrow title="Cindy Baker">
                  <Avatar component={Link} href="#" alt="Cindy Baker" src="/static/images/avatars/3.jpg" />
                </Tooltip>
                <Tooltip arrow title="Agnes Walker">
                  <Avatar component={Link} href="#" alt="Agnes Walker" src="/static/images/avatars/4.jpg" />
                </Tooltip>
              </AvatarGroup>
            </Box>
          </Box> */}
              <Divider sx={{ my: 3 }} />
              <Box px={3}>
                <Typography variant="h3" sx={{ mb: 3 }}>
                  {t('Details')}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item sm={5}>
                    <Typography variant="subtitle2">{t('WinRate')}:</Typography>
                  </Grid>
                  <Grid item sm={7}>
                    <Typography variant="subtitle2" color="text.primary">
                      {parseInt(`${history.winRate}`, 10)} %
                    </Typography>
                  </Grid>
                  <Grid item sm={5}>
                    <Typography variant="subtitle2">{t('Total Bets')}:</Typography>
                  </Grid>
                  <Grid item sm={7}>
                    <Typography variant="subtitle2" color="text.primary">
                      {history.totalBets}
                    </Typography>
                  </Grid>
                  <Grid item sm={5}>
                    <Typography variant="subtitle2">{t('Net BNB')}:</Typography>
                  </Grid>
                  <Grid item sm={7}>
                    <Typography variant="subtitle2" color="text.primary">
                      {parseFloat(history.netBNB).toFixed(4)} BNB
                    </Typography>
                  </Grid>

                  <Grid item sm={5}>
                    <Typography variant="subtitle2">{t('Total Played')}:</Typography>
                  </Grid>
                  <Grid item sm={7}>
                    <Typography variant="subtitle2" color="text.primary">
                      {parseFloat(history.totalBNB).toFixed(4)} BNB
                    </Typography>
                  </Grid>
                  <Grid item sm={5}>
                    <Typography variant="subtitle2">{t('Average BNB')}:</Typography>
                  </Grid>
                  <Grid item sm={7}>
                    <Typography variant="subtitle2" color="text.primary">
                      {parseFloat(history.averageBNB).toFixed(4)} BNB
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 3 }} />
            </>
          )}
          {currentTab === 'activity' && (
            <List disablePadding>
              <ListSubheaderLarge disableSticky color="primary">
                {t('Bet History')}
              </ListSubheaderLarge>
              <Divider />

              {history.bets.map((bet) => (
                <>
                  <ListSubheader disableSticky color="primary">
                    Epoch {bet.round.epoch}
                    {' - '}
                    {formatDistance(new Date(+bet.createdAt * 1000), new Date(), {
                      addSuffix: true,
                    })}
                  </ListSubheader>
                  <Divider />

                  <ListItem alignItems="flex-start" sx={{ py: 2 }} key={bet.createdAt}>
                    <ListItemAvatar>
                      {bet.position === bet.round.position ? (
                        <AvatarWrapperSuccess>
                          <TrendingUp fontSize="medium" />
                        </AvatarWrapperSuccess>
                      ) : (
                        <AvatarWrapperError>
                          <TrendingDown fontSize="medium" />
                        </AvatarWrapperError>
                      )}
                      {/* {bet.position === 'Bull' ? (
                        <AvatarWrapperSuccess>
                          <TrendingUp fontSize="medium" />
                        </AvatarWrapperSuccess>
                      ) : bet.position === 'Bear' ? (
                        <AvatarWrapperError>
                          <TrendingDown fontSize="medium" />
                        </AvatarWrapperError>
                      ) : (
                        <AvatarWrapperWarning>
                          <TrendingFlat fontSize="medium" />
                        </AvatarWrapperWarning>
                      )} */}
                    </ListItemAvatar>
                    <ListItemText
                      secondary={
                        <>
                          <Box display="flex" alignItems="center" py={0.5}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap color="text.primary">
                              {t('BET ')} {bet.position.toUpperCase()}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" py={0.5}>
                            {/* <PictureAsPdfTwoToneIcon /> */}
                            <Typography variant="body1" fontWeight="bold" color="text.secondary">
                              {t('Bet Amount :')} {parseFloat(bet.amount).toFixed(4)} BNB
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          {/* <Box display="flex" alignItems="center" py={0.5}>
                            <Typography
                              variant="body2"
                              color={bet.position === bet.round.position ? 'success' : 'error'}
                              fontWeight="bold"
                              gutterBottom
                              noWrap>
                              {bet.position === bet.round.position
                                ? `${t('Won : ') + getWinLossAmount(bet)} BNB - ${t('Rate ')}${getWinLossRate(bet)}`
                                : `${t('Loose : ') + getWinLossAmount(bet)} BNB`}
                            </Typography>
                          </Box> */}
                          <Box display="flex" alignItems="center" py={0.5}>
                            <ListItemText
                              secondary={
                                <Text color={bet.position === bet.round.position ? 'success' : 'error'}>
                                  {`${
                                    bet.position === bet.round.position ? t('Won : ') : t('Loose : ')
                                  } ${getWinLossAmount(bet)} BNB - ${t('Rate ')}${getWinLossRate(bet)}`}
                                </Text>
                              }
                              secondaryTypographyProps={{
                                variant: 'body2',
                                noWrap: true,
                                gutterBottom: true,
                                fontWeight: 'bold',
                              }}
                            />
                          </Box>
                        </>
                      }
                      secondaryTypographyProps={{
                        variant: 'body1',
                        color: 'textPrimary',
                        noWrap: true,
                      }}
                    />
                  </ListItem>
                </>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  )
}

// SidebarPlayerDrawer.defaultProps = {
//   playerId: null,
// }

SidebarPlayerDrawer.propTypes = {
  playerId: PropTypes.string.isRequired,
}

export default SidebarPlayerDrawer
