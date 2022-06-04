import 'moment-timezone'

import { Box, Grid, LinearProgress, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActiveTotalAmount from 'src/client/components/Dashboards/Commerce/ActiveTotalAmount'
import ActiveTotalBears from 'src/client/components/Dashboards/Commerce/ActiveTotalBears'
import ActiveTotalBets from 'src/client/components/Dashboards/Commerce/ActiveTotalBets'
import ActiveTotalBulls from 'src/client/components/Dashboards/Commerce/ActiveTotalBulls'
import FollowPlayersPromotion from 'src/client/components/Dashboards/Healthcare/doctor/FollowPlayersPromotion'
import ActiveLiveBets from 'src/client/components/Dashboards/Healthcare/hospital/ActiveLiveBets'
import LiveActivePlayers from 'src/client/components/Dashboards/Learning/LiveActivePlayers'
import Footer from 'src/client/components/Footer'
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated'
import useRefMounted from 'src/client/hooks/useRefMounted'
import MainLayout from 'src/client/layouts/MainLayout'
import loadGameData from 'src/client/thegraph/loadGameData'
import wait from 'src/client/utils/wait'
import { PREDICTION_CONTRACT_ABI } from 'src/contracts/abis/pancake-prediction-abi-v3'

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    // flex-grow: 1;
    // margin-right: ${theme.spacing(1)};
    // height: 10px;
    // background-color: ${theme.colors.alpha.trueWhite[100]};
    background-color: ${theme.colors.error.main};

    .MuiLinearProgress-bar1Buffer {
      background-color: ${theme.colors.success.main};
      // border-top-right-radius: ${theme.general.borderRadius};
      // border-bottom-right-radius: ${theme.general.borderRadius};
    }
    .MuiLinearProgress-bar2Buffer {
      background-color: ${theme.colors.warning.main};
      // border-top-right-radius: ${theme.general.borderRadius};
      // border-bottom-right-radius: ${theme.general.borderRadius};
    }
    .MuiLinearProgress-dashedColorPrimary {
      // background-color: ${theme.colors.alpha.trueWhite[100]};
      background: ${theme.colors.alpha.trueWhite[100]};
      // background-color: ${theme.colors.error.main};
      // border-top-right-radius: ${theme.general.borderRadius};
      // border-bottom-right-radius: ${theme.general.borderRadius};
    }
`
)

const LiveView = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const isMountedRef = useRefMounted()
  const [epoch, setEpoch] = useState<string>('')
  const [user, setUser] = useState<User | any>(null)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  const [userBulls, setUserBulls] = useState<any>([])
  const [userBears, setUserBears] = useState<any>([])
  // const [preditionContract, setPreditionContract] = useState<any>(null)
  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date().getTime() - 60))
  // const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(new Date().getTime()))
  // const [timeLeft, setTimeLeft] = useState<any>(null)
  const [startTimestamp, setStartTimestamp] = useState<any>(null)

  // const [timerComponents, setTimerComponents] = useState<any>(null)
  const [progressValue, setProgressValue] = useState<number>(0)

  const router = useRouter()

  const [{ data }] = useGetCurrentUserQuery()

  const calculateTimeLeft = (timestamp) => {
    // if (!timestamp) return
    // if (!timestamp) timestamp = new Date().getTime()

    // let difference = +new Date(timestamp) - +new Date()
    // let difference = +new Date().getTime() - timestamp
    const difference = Math.floor(new Date().getTime() / 1000) - timestamp
    // console.log('🚀 ~ difference', difference)

    return difference > 0 ? difference : 0

    // console.log('🚀 ~ minutes', Math.floor((difference / 60) % 60))
    // console.log('🚀 ~ seconds', Math.floor(difference % 60))
    // let timeLeft = {}

    // if (difference > 0) {
    //   timeLeft = {
    //     // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    //     // hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    //     minutes: Math.floor((difference / 60) % 60),
    //     seconds: Math.floor(difference % 60),
    //   }
    // }

    // return timeLeft
  }

  const initialize = useCallback(
    async (ppreditionContract) => {
      const betBullListenner = async (sender, eventEpoch, amount) => {
        // if (eventEpoch !== epoch) return

        const player = userBulls.find((p) => p.sender === sender)
        if (!player) {
          userBulls.unshift({
            betBull: true,
            address: sender,
            amount: ethers.utils.formatEther(amount),
            epoch: eventEpoch,
          })
          // setUserBulls(userBulls)
          setUserBulls([...userBulls])
          console.log(`[BET-BULL] for epoch ${eventEpoch} - ${userBulls.length}`)
          const ltimeLeft = calculateTimeLeft(startTimestamp)
          // setTimeLeft(ltimeLeft)
          const total = 5 * 60
          const actual = total - ltimeLeft
          const generated = (actual * 100) / total
          // console.log('🚀 ~ total', 100 - generated)
          setProgressValue(100 - generated)
        }
      }

      const betBearListenner = async (sender, eventEpoch, amount) => {
        // if (eventEpoch !== epoch) return

        const player = userBears.find((p) => p.sender === sender)
        if (!player) {
          userBears.unshift({
            betBull: false,
            address: sender,
            amount: ethers.utils.formatEther(amount),
            epoch: eventEpoch,
          })
          // setUserBears(userBears)
          setUserBears([...userBears])
          console.log(`[BET-BEAR] for eventEpoch ${eventEpoch} - ${userBears.length}`)
          // const _timeLeft = calculateTimeLeft(new Date().getTime())
          const ltimeLeft = calculateTimeLeft(startTimestamp)
          // setTimeLeft(ltimeLeft)
          // console.log('🚀 ~ file: index.tsx ~ line 125 ~ initialize ~ _timeLeft', ltimeLeft)
          const total = 5 * 60
          const actual = total - ltimeLeft
          const generated = (actual * 100) / total
          // console.log('🚀 ~ total', 100 - generated)
          setProgressValue(100 - generated)
        }
      }

      const roundStartListenner = async (currentEpoch) => {
        console.log(`[ROUND] Round started for epoch ${+currentEpoch}`)
        enqueueSnackbar(t(`[ROUND] Round started for epoch ${+currentEpoch}`), {
          variant: 'success',
          TransitionComponent: Zoom,
        })
        // setUserBulls([])
        // setUserBears([])
        // await utils.sleep(30 * 1000)
        setEpoch(currentEpoch)

        const lstartTimestamp = new Date().getTime()
        // const ltimeLeft = calculateTimeLeft(lstartTimestamp)
        // setTimeLeft(ltimeLeft)
        setStartTimestamp(lstartTimestamp.toString())
        // setProgressValue(0)
      }

      const roundEndListenner = async (currentEpoch) => {
        console.log(`[ROUND] Round finished for epoch ${+currentEpoch}`)

        // ppreditionContract.off('BetBull', betBullListenner)
        // ppreditionContract.off('BetBear', betBearListenner)

        enqueueSnackbar(t(`[ROUND] Round finished for epoch ${+currentEpoch}`), {
          variant: 'success',
          TransitionComponent: Zoom,
        })

        // await utils.sleep(10 * 1000)
        setUserBulls([])
        setUserBears([])
        userBulls.length = 0
        userBears.length = 0
        setProgressValue(0)

        await wait(5 * 1000)

        // try {
        //   ppreditionContract.on('BetBull', betBullListenner)
        //   ppreditionContract.on('BetBear', betBearListenner)
        // } catch (error) {
        //   console.error(error)
        //   enqueueSnackbar(t(`[ERROR] Error during smart contract listening... Please refresh the page`), {
        //     variant: 'error',
        //     TransitionComponent: Zoom,
        //   })
        // }
      }

      if (!ppreditionContract) return

      const lisPaused = await ppreditionContract.paused()
      setIsPaused(lisPaused)
      if (lisPaused) {
        enqueueSnackbar(t(`[LAUNCH] Contract is actually paused`), {
          variant: 'error',
          TransitionComponent: Zoom,
        })
        // return
      }

      const lepoch = await ppreditionContract.currentEpoch()
      setEpoch(lepoch)

      const { startTimestamp: start } = await ppreditionContract.rounds(lepoch)

      const ltimeLeft = calculateTimeLeft(start.toString())
      // setTimeLeft(ltimeLeft)
      setStartTimestamp(start.toString())
      console.log('🚀 ~ file: index.tsx ~ line 125 ~ initialize ~ ltimeLeft', ltimeLeft)
      const total = 5 * 60
      const actual = total - ltimeLeft
      const generated = (actual * 100) / total
      console.log('🚀 ~ generated', generated)
      console.log('🚀 ~ total', 100 - generated)
      setProgressValue(100 - generated)

      enqueueSnackbar(t(`[LAUNCH] Stated to listen contract, current epoch is ${lepoch}`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })

      try {
        ppreditionContract.on('StartRound', roundStartListenner)
        ppreditionContract.on('EndRound', roundEndListenner)
        ppreditionContract.on('BetBull', betBullListenner)
        ppreditionContract.on('BetBear', betBearListenner)
        // enqueueSnackbar(t(`[LAUNCH] Stated to listen contract`), {
        //   variant: 'success',
        //   TransitionComponent: Zoom,
        // })
      } catch (error) {
        console.error(error)
        enqueueSnackbar(t(`[ERROR] Error during smart contract listening... Please refresh the page`), {
          variant: 'error',
          TransitionComponent: Zoom,
        })
        // router.push('/app')
      }

      try {
        console.log('🚀 ~ LOADING gameData', lepoch.toString())
        const round = await loadGameData({ epoch: lepoch })

        // if (!round) return

        console.log('🚀 ~  checkEpoch ~ round', round, 'bets', round.bets.length)
        // setRound(round)
        round?.bets.map((bet) => {
          if (bet.position === 'Bull') {
            userBulls.unshift({ betBull: true, address: bet.id, amount: bet.amount, epoch: lepoch })
            // setUserBulls(userBulls)
            setUserBulls([...userBulls])
          } else if (bet.position === 'Bear') {
            userBears.unshift({ betBull: false, address: bet.id, amount: bet.amount, epoch: lepoch })
            // setUserBears(userBears)
            setUserBears([...userBears])
          }
          return bet
        })
        enqueueSnackbar(t(`[SYNC] Syncronising with actual round data done`), {
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
    },
    [enqueueSnackbar, t, userBulls, userBears, startTimestamp]
  )

  useEffect(() => {
    if (!data) return

    if (user) return

    // if (!data.currentUser) {
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

    if (isMountedRef.current) {
      const lprovider = new ethers.providers.Web3Provider(window.ethereum)
      setUser(data?.currentUser)

      // const privateKey = decrypt(data.currentUser.private)

      // const signer = new ethers.Wallet(privateKey, lprovider)

      // const signer = lprovider.getSigner()

      const lpreditionContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
        PREDICTION_CONTRACT_ABI,
        // signer
        lprovider
      )

      initialize(lpreditionContract)
    }
  }, [data, user, initialize, isMountedRef, router, enqueueSnackbar, t])

  return (
    <>
      <Head>
        <title>Play live</title>
      </Head>
      {!isPaused && epoch && progressValue ? (
        <Box sx={{ mt: 1 }}>
          <LinearProgressWrapper variant="buffer" value={progressValue} valueBuffer={80} />
        </Box>
      ) : (
        <></>
      )}
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item lg={8} xs={12}>
            {/* <ActiveLiveBets timeLeft={timeLeft} epoch={epoch} userBulls={userBulls} userBears={userBears} /> */}
            <ActiveLiveBets epoch={epoch} userBulls={userBulls} userBears={userBears} />
          </Grid>
          <Grid item lg={4} xs={12}>
            {/* <LiveActivePlayers liveUserBettors={[].concat(userBulls, userBears)} /> */}
            {/* <LiveActivePlayers liveUserBettors={[...userBulls, ...userBears]} /> */}
            <LiveActivePlayers userBulls={userBulls} userBears={userBears} />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
              <Grid item lg={3} sm={6} xs={12}>
                <ActiveTotalBulls userBulls={userBulls} userBears={userBears} />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <ActiveTotalBears userBulls={userBulls} userBears={userBears} />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <ActiveTotalAmount userBulls={userBulls} userBears={userBears} />
              </Grid>
              <Grid item lg={3} sm={6} xs={12}>
                <ActiveTotalBets userBulls={userBulls} userBears={userBears} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FollowPlayersPromotion />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Leaderboard />
          </Grid>
          <Grid item xs={12} md={6}>
            <Leaderboard />
          </Grid>
          <Grid item xs={12}>
            <TransactionsStatistics />
          </Grid> */}
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default LiveView

LiveView.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
