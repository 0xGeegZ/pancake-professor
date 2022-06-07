import 'moment-timezone'

import gini from 'gini'

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
    for (let i = 0; i < obj?.length; i++) {
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
        giniCoefficient: '-',
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
          // return parseFloat(reduced).toFixed(4)
          return reduced
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
          // return parseFloat(reduced).toFixed(4)
          return +reduced
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

      // const totalLossCount = statistics.totalLoss.reduce((accu, value) => {
      //   return +accu + +value
      // }, 0)

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
        console.log('🚀 ~ file: index.tsx ~ line 177 ~ pmultiplier', pmultiplier)
        // TODO error if player has no more game before date inside current range
        statistics.daysPlayedCurrentPeriod = (entries.length * 100) / (pmultiplier < 50 ? pmultiplier : daysTotal)
      }

      // const minMaxScalling = (val, max, min) => {
      //   return (val - min) / (max - min)
      // }

      // const normalize = (list) => {
      //   const minMax = list.reduce(
      //     (acc, value) => {
      //       if (value < acc.min) {
      //         acc.min = value
      //       }

      //       if (value > acc.max) {
      //         acc.max = value
      //       }

      //       return acc
      //     },
      //     { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
      //   )

      //   return list.map((value) => {
      //     // Verify that you're not about to divide by zero
      //     if (minMax.max === minMax.min) {
      //       return 1 / list.length
      //     }

      //     const diff = minMax.max - minMax.min
      //     return (value - minMax.min) / diff
      //   })
      // }

      // Shannon entropy in bits per symbol.
      // const entropy = (array) => {
      //   // const len = str.length
      //   const len = array.length

      //   // // Build a frequency map from the string.
      //   // const frequencies = Array.from(str).reduce((freq, c) => (freq[c] = (freq[c] || 0) + 1) && freq, {})

      //   // Sum the frequency of each character.
      //   // return Object.values(frequencies).reduce((sum, f) => sum - (f / len) * Math.log2(f / len), 0)
      //   return array.reduce((sum, f) => sum - (f / len) * Math.log2(f / len), 0)
      // }

      // const entropyV2 = (str) => {
      //   const len = str.length

      //   // Build a frequency map from the string.
      //   const frequencies = Array.from(str).reduce((freq, c) => (freq[c] = (freq[c] || 0) + 1) && freq, {})

      //   // Sum the frequency of each character.
      //   return Object.values(frequencies).reduce((sum, f) => sum - (f / len) * Math.log2(f / len), 0)
      // }

      console.log('AAAAAAAAAAAAAAAAAAAAAAA')

      const totalGamesArray = []

      console.log('🚀 ~ file: index.tsx ~ line 200 ~ statistics.totalWon ', statistics.totalWon)
      console.log('🚀 ~ file: index.tsx ~ line 200 ~ statistics.totalLoss ', statistics.totalLoss)

      for (let i = 0; i < statistics.totalWon.length; i += 1) {
        // classic list
        // totalGamesArray.push(+statistics.totalWon[i])
        // // totalGamesArray.push(+statistics.totalLoss[i])
        // divisition
        // totalGamesArray.push(+statistics.totalWon[i] / +statistics.totalLoss[i])
        // minMaxScalling
        // totalGamesArray.push(statistics.totalWon[i])
        // totalGamesArray.push(+statistics.totalLoss[i])
        // totalGamesArray.push(statistics.totalLoss[i] * -1)
        // gini
        // totalGamesArray.push(statistics.totalWon[i] / (statistics.totalWon[i] + statistics.totalLoss[i]))
        totalGamesArray.push((statistics.totalWon[i] * 100) / statistics.totalPlayed[i])
      }
      console.log('🚀 ~ file: index.tsx ~ line 194 ~ totalGamesArray', totalGamesArray)

      // const normalized = normalize(totalGamesArray)
      // console.log('🚀 ~ file: index.tsx ~ line 229 ~ normalized', normalized)

      // const test = entropyV2(normalized.join())
      // console.log('🚀 ~ file: loadPlayers.js ~ line 69 ~ checkIfPlaying ~ test', test)
      if (totalGamesArray.length > 1) {
        statistics.giniCoefficient = gini.unordered(totalGamesArray)
        statistics.giniCoefficient = parseFloat(`${statistics.giniCoefficient}`).toFixed(4)
        console.log('🚀 ~ file: index.tsx ~ line 270 ~ statistics.giniCoefficient', statistics.giniCoefficient)
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

      console.log('🚀 ~ file: index.tsx ~ line 288 ~ initialize ~ playerId', playerId)

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
      enqueueSnackbar(t(`[ERROR] Error when getting player history`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }
  }, [enqueueSnackbar, t, playerId, loadStastistics, multiplier])

  useEffect(() => {
    if (isLoading) return
    // if (!playerId) return

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
  }, [initialize, isLoading, isMountedRef, enqueueSnackbar, t, playerId])

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
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ px: 0, pt: 0 }}>
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
              <Grid item xs={12}>
                <Card sx={{ px: 0, pt: 0 }}>
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
              <Grid item xs={12}>
                <Card sx={{ px: 0, pt: 0 }}>
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
              <Grid item xs={12}>
                <Card sx={{ px: 0, pt: 0 }}>
                  <CardHeader
                    sx={{ pb: 0 }}
                    titleTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'bold',
                      color: 'textSecondary',
                    }}
                    action={
                      <Tooltip
                        placement="top"
                        arrow
                        title={t(
                          'A score of 0 means that the player won more than he loose every days he plays. Under 0.1 is a good indicator.'
                        )}>
                        <IconButton size="small" color="secondary">
                          <HelpOutlineTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={t('Gini coefficient')}
                  />
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Typography variant="h4">{player?.statistics?.giniCoefficient || 0}</Typography>
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
