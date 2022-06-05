import 'moment-timezone'

import moment from 'moment'
import { Box, Grid, Zoom, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone'
import Label from 'src/client/components/Label'

import Head from 'next/head'
import { useRouter } from 'next/router'
// import Leaderboard from 'src/client/components/Dashboards/Learning/Leaderboard'
import PlayerHistoryStatistics from 'src/client/components/Dashboards/Banking/PlayerHistoryStatistics'

import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from 'src/client/components/Footer'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'
import loadPlayer from 'src/client/thegraph/loadPlayer'
import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const PlayerStats = ({ playerId: pplayerId }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const isMountedRef = useRefMounted()
  // const [user, setUser] = useState<User | any>(null)
  const [player, setPlayer] = useState<any>(null)
  const [multiplier, setMultiplier] = useState<number>(7)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()
  const playerId = router.query.playerId || pplayerId

  // const [{ data }] = useGetCurrentUserQuery()

  // Group by time period - By 'day' | 'week' | 'month' | 'year'
  // ------------------------------------------------------------
  const groupByTimePeriod = (obj, timestamp, period) => {
    const objPeriod = {}
    const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    for (let i = 0; i < obj.length; i++) {
      let d = new Date(obj[i][timestamp] * 1000)
      if (period == 'day') {
        d = Math.floor(d.getTime() / oneDay)
      } else if (period == 'week') {
        d = Math.floor(d.getTime() / (oneDay * 7))
      } else if (period == 'month') {
        d = (d.getFullYear() - 1970) * 12 + d.getMonth()
      } else if (period == 'year') {
        d = d.getFullYear()
      } else {
        console.log('groupByTimePeriod: You have to set a period! day | week | month | year')
      }
      // define object key
      objPeriod[d] = objPeriod[d] || []
      objPeriod[d].push(obj[i])
    }
    return objPeriod
  }

  const loadStastistics = useCallback(
    async (pplayer, pmultiplier) => {
      const statistics = {
        totalWon: [],
        totalLoss: [],
        totalPlayed: [],
        weekLabels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
        winRateCurrentPeriod: 0,
        totalBetsCurrentPeriod: 0,
        totalWonCurrentPeriod: 0,
        averageBetsByDayCurrentPeriod: 0,
        daysPlayedCurrentPeriod: 0,
      }

      const groupeds = groupByTimePeriod(pplayer?.bets, 'createdAt', 'day')

      const now = new Date()
      const oneDay = 24 * 60 * 60 * 1000
      const timestamp = Math.floor(now.getTime() / oneDay)

      const entries = Object.entries(groupeds).filter((element) => {
        // return +element[0] >= timestamp - multiplier && +element[0] !== timestamp
        // return +element[0] >= timestamp - pmultiplier
        return +element[0] > timestamp - pmultiplier
      })

      // if (entries.length === 0) {
      //   const newMultiplier = 31
      //   // setMultiplier(newMultiplier)
      //   entries = Object.entries(groupeds).filter((element) => {
      //     return +element[0] >= timestamp - newMultiplier
      //   })
      // }

      statistics.totalPlayed = entries
        .map((element) => {
          return element[1]
        })
        .map((element) => {
          const reduced = element.reduce((accu, bet) => {
            return +accu + 1
          }, 0)
          return parseFloat(reduced).toFixed(4)
        })

      statistics.totalWon = entries
        .map((element) => {
          return element[1]
        })
        .map((element) => {
          const reduced = element.reduce((accu, bet) => {
            if (bet?.position === bet?.round?.position) return +accu + 1
            return +accu
          }, 0)
          return parseFloat(reduced).toFixed(4)
        })

      statistics.totalLoss = entries
        .map((element) => {
          return element[1]
        })
        .map((element) => {
          const reduced = element.reduce((accu, bet) => {
            if (bet?.position !== bet?.round?.position) return +accu + 1
            return +accu
          }, 0)
          return parseFloat(reduced).toFixed(4)
        })

      statistics.weekLabels = entries.map(([element]) => {
        const date = moment(new Date(Math.floor(element * oneDay)))
        return date.format('L')
        // return pmultiplier <= 10 ? date.format('DD/MM') : date.format('DD/MM/YY')
      })

      const totalPlayedCount = statistics.totalPlayed.reduce((accu, value) => {
        return +accu + +value
      }, 0)
      const totalWonCount = statistics.totalWon.reduce((accu, value) => {
        return +accu + +value
      }, 0)

      statistics.winRateCurrentPeriod = (totalWonCount * 100) / totalPlayedCount

      statistics.totalBetsCurrentPeriod = totalPlayedCount
      statistics.totalWonCurrentPeriod = totalWonCount
      statistics.averageBetsByDayCurrentPeriod = statistics.totalBetsCurrentPeriod / entries.length

      // calculate number of days from first day to last day in entries

      const dates = entries.map((element) => {
        return element[0]
      })

      if (dates.length) {
        // console.log('🚀 ~ file: index.tsx ~ line 157 ~ dates ~ dates', dates)
        const from = moment(new Date(Math.floor(dates[0] * oneDay)))
        console.log("🚀 ~ file: index.tsx ~ line 154 ~ from.format('L')", from.format('L'))

        const to = moment(new Date(Math.floor(dates[dates.length - 1] * oneDay)))
        console.log("🚀 ~ file: index.tsx ~ line 154 ~ to.format('L')", to.format('L'))

        const daysPlayed = to.diff(from, 'days')
        console.log('🚀 ~ file: index.tsx ~ line 164 ~ daysPlayed', daysPlayed)

        // const today = moment(new Date())
        const today = moment().add(1, 'days')
        console.log("🚀 ~ file: index.tsx ~ line 154 ~ today.format('L')", today.format('L'))

        const daysTotal = today.diff(from, 'days')
        console.log('🚀 ~ file: index.tsx ~ line 164 ~ daysTotal', daysTotal)
        console.log('🚀 ~ file: index.tsx ~ line 164 ~ entries.length', entries.length)
        statistics.daysPlayedCurrentPeriod = (entries.length * 100) / daysTotal
      }

      setPlayer({
        ...pplayer,
        statistics,
      })
    },
    [setPlayer]
  )

  const initialize = useCallback(async () => {
    try {
      if (!playerId) return

      const pplayer = await loadPlayer(playerId)

      enqueueSnackbar(t(`[SYNC] Data loaded for player ${pplayer.id}`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })

      if (pplayer?.bets) {
        loadStastistics(pplayer, multiplier)
      } else setPlayer(pplayer)
    } catch (error) {
      console.error(error)
      enqueueSnackbar(t(`[ERROR] Error when getting smart contract round data. Starting colleting data from now`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }
  }, [enqueueSnackbar, t, playerId, loadStastistics, multiplier])

  useEffect(() => {
    if (isLoading) return

    setIsLoading(true)

    if (!window.ethereum?.request) {
      enqueueSnackbar(t(`You need to have metamask installed on your browser.`), {
        variant: 'warning',
        TransitionComponent: Zoom,
      })
      return
    }

    if (isMountedRef.current) {
      // setUser(data?.currentUser)

      initialize()
    }
  }, [initialize, isLoading, isMountedRef, enqueueSnackbar, t])

  const updateDataForPeriod = (pmultiplier) => {
    setMultiplier(pmultiplier)

    loadStastistics(player, pmultiplier)
  }

  return (
    <>
      <Head>
        <title>Player Stats</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item lg={10} xs={12}>
            <PlayerHistoryStatistics
              player={player}
              updateDataForPeriod={updateDataForPeriod}
              multiplier={multiplier}
            />
          </Grid>

          <Grid item lg={2} xs={12}>
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2.5}>
              <Grid item lg={4} sm={4} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Total wons for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Total Wons')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">
                      {player?.statistics?.totalWonCurrentPeriod || 0}/{player?.statistics?.totalBetsCurrentPeriod || 0}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Label
                        color={
                          (player?.statistics?.totalWonCurrentPeriod * 100) /
                            player?.statistics?.totalBetsCurrentPeriod >
                          50
                            ? 'success'
                            : 'error'
                        }>
                        {player?.statistics?.totalBetsCurrentPeriod > 0
                          ? parseFloat(
                              (
                                (player?.statistics?.totalWonCurrentPeriod * 100) /
                                player?.statistics?.totalBetsCurrentPeriod
                              ).toString()
                            ).toFixed(2)
                          : 0}
                        %
                      </Label>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={4} sm={4} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Average bets/day for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Avg bets/day')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">
                      {parseFloat(player?.statistics?.averageBetsByDayCurrentPeriod || 0).toFixed(1)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={4} sm={4} xs={12}>
                <Card sx={{ px: 1, pt: 1 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip placement="top" arrow title={t('Average days played for current period.')}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Days played')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">
                      {parseFloat(player?.statistics?.daysPlayedCurrentPeriod || 0).toFixed(2)}%
                    </Typography>
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
                    <Typography variant="h3">{parseFloat(player?.winRate || 0).toFixed(2)}%</Typography>
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
                    <Typography variant="h3">{player?.totalBets || 0}</Typography>
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
                    <Typography variant="h3">{parseFloat(player?.netBNB || 0).toFixed(2)} BNB</Typography>
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
                    <Typography variant="h3">{parseFloat(player?.averageBNB || 0).toFixed(4)} BNB</Typography>
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
