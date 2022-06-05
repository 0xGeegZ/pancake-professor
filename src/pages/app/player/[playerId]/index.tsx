import 'moment-timezone'

import {
  Box,
  Grid,
  LinearProgress,
  Zoom,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'

import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Leaderboard from 'src/client/components/Dashboards/Learning/Leaderboard'
import PlayerHistoryStatistics from 'src/client/components/Dashboards/Banking/PlayerHistoryStatistics'

import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActiveTotalAmount from 'src/client/components/Dashboards/Commerce/ActiveTotalAmount'
import ActiveTotalBears from 'src/client/components/Dashboards/Commerce/ActiveTotalBears'
import ActiveTotalBets from 'src/client/components/Dashboards/Commerce/ActiveTotalBets'
import ActiveTotalBulls from 'src/client/components/Dashboards/Commerce/ActiveTotalBulls'
import FollowPlayersPromotion from 'src/client/components/Dashboards/Healthcare/doctor/FollowPlayersPromotion'
import PlayerStatsDayAverage from 'src/client/components/Dashboards/Healthcare/hospital/PlayerStatsDayAverage'
import LiveActivePlayers from 'src/client/components/Dashboards/Learning/LiveActivePlayers'
import Footer from 'src/client/components/Footer'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'
import loadGameData from 'src/client/thegraph/loadGameData'
import wait from 'src/client/utils/wait'
import { PREDICTION_CONTRACT_ABI } from 'src/contracts/abis/pancake-prediction-abi-v3'
import loadPlayer from 'src/client/thegraph/loadPlayer'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const PlayerStats = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const isMountedRef = useRefMounted()
  const [user, setUser] = useState<User | any>(null)
  const [player, setPlayer] = useState<any>(null)

  const router = useRouter()
  const { playerId } = router.query
  console.log('🚀 ~ file: index.tsx ~ line 43 ~ PlayerStats ~ playerId', playerId)

  const [{ data }] = useGetCurrentUserQuery()

  const initialize = useCallback(async () => {
    try {
      const pplayer = await loadPlayer(playerId)
      setPlayer(pplayer)

      enqueueSnackbar(t(`[SYNC] Data loaded for player ${pplayer.id}`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })
    } catch (error) {
      console.error(error)
      enqueueSnackbar(t(`[ERROR] Error when getting smart contract round data. Starting colleting data from now`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }
  }, [enqueueSnackbar, t, playerId])

  useEffect(() => {
    if (!data) return

    if (user) return

    if (!window.ethereum?.request) {
      enqueueSnackbar(t(`You need to have metamask installed on your browser.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }

    if (isMountedRef.current) {
      setUser(data?.currentUser)

      initialize()
    }
  }, [data, user, initialize, isMountedRef, enqueueSnackbar, t])

  return (
    <>
      <Head>
        <title>Player Stats</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item lg={10} xs={12}>
            <PlayerHistoryStatistics player={player} />
          </Grid>

          <Grid item lg={2} xs={12}>
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={5}>
              <Grid item lg={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Winrate for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Winrate')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">{parseFloat(player?.winRate).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Total bets for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Total bets')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">{player?.totalBets}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Net BNB amount won/loss for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Net BNB')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">{parseFloat(player?.netBNB).toFixed(2)} BNB</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item lg={3} sm={6} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    // action={
                    //   <Tooltip placement="top" arrow title={t('Lifetime winrate.')}>
                    //     <IconButton size="small" color="secondary">
                    //       <HelpOutlineTwoToneIcon fontSize="small" />
                    //     </IconButton>
                    //   </Tooltip>
                    // }
                    title={t('Lifetime Winrate')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h3">{parseFloat(player?.winRate).toFixed(2)}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    // action={
                    //   <Tooltip placement="top" arrow title={t('Lifetime total bets.')}>
                    //     <IconButton size="small" color="secondary">
                    //       <HelpOutlineTwoToneIcon fontSize="small" />
                    //     </IconButton>
                    //   </Tooltip>
                    // }
                    title={t('Lifetime Total bets')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h3">{player?.totalBets}</Typography>
                  </CardContent>
                </Card>{' '}
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    // action={
                    //   <Tooltip placement="top" arrow title={t('Lifetime Net BNB amount won/loss.')}>
                    //     <IconButton size="small" color="secondary">
                    //       <HelpOutlineTwoToneIcon fontSize="small" />
                    //     </IconButton>
                    //   </Tooltip>
                    // }
                    title={t('Lifetime Net BNB')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h3">{parseFloat(player?.netBNB).toFixed(2)} BNB</Typography>
                  </CardContent>
                </Card>{' '}
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    // action={
                    //   <Tooltip placement="top" arrow title={t('Lifetime average BNB.')}>
                    //     <IconButton size="small" color="secondary">
                    //       <HelpOutlineTwoToneIcon fontSize="small" />
                    //     </IconButton>
                    //   </Tooltip>
                    // }
                    title={t('Lifetime Average BNB')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h3">{parseFloat(player?.averageBNB).toFixed(4)} BNB</Typography>
                  </CardContent>
                </Card>{' '}
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12}>
            <LiveActivePlayers userBulls={[]} userBears={[]} />
          </Grid>
          <Grid item xs={12}>
            <PlayerStatsDayAverage player={player} />
          </Grid> */}
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default PlayerStats

PlayerStats.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
