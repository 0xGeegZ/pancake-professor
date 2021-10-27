import 'moment-timezone';

import FollowPlayersPromotion from '@/client/components/Dashboards/Healthcare/doctor/FollowPlayersPromotion';
import ActiveLiveBets from '@/client/components/Dashboards/Healthcare/hospital/ActiveLiveBets';
import LiveActivePlayers from '@/client/components/Dashboards/Learning/LiveActivePlayers';
import { Box, Grid, LinearProgress, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ethers } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActiveTotalAmount from 'src/client/components/Dashboards/Commerce/ActiveTotalAmount';
import ActiveTotalBears from 'src/client/components/Dashboards/Commerce/ActiveTotalBears';
import ActiveTotalBets from 'src/client/components/Dashboards/Commerce/ActiveTotalBets';
import ActiveTotalBulls from 'src/client/components/Dashboards/Commerce/ActiveTotalBulls';
import Footer from 'src/client/components/Footer';
import { useGetCurrentUserQuery } from 'src/client/graphql/getCurrentUser.generated';
import useRefMounted from 'src/client/hooks/useRefMounted';
import MainLayout from 'src/client/layouts/MainLayout';
import loadGameData from 'src/client/thegraph/loadGameData';

import type { ReactElement } from 'react'
import type { User } from 'src/client/models/user'

const { PREDICTION_CONTRACT_ABI } = require('src/client/abis/pancake-prediction-abi-v3')

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

const calculateTimeLeft = (timestamp) => {
  // if (!timestamp) return
  // if (!timestamp) timestamp = new Date().getTime()

  // let difference = +new Date(timestamp) - +new Date()
  // let difference = +new Date().getTime() - timestamp
  const difference = Math.floor(new Date().getTime() / 1000) - timestamp
  console.log('🚀 ~ difference', difference)

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

const LiveView = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t }: { t: any } = useTranslation()

  const isMountedRef = useRefMounted()
  const [epoch, setEpoch] = useState<String>('')
  const [user, setUser] = useState<User | any>(null)
  const [userBulls, setUserBulls] = useState<any>([])
  const [userBears, setUserBears] = useState<any>([])
  const [preditionContract, setPreditionContract] = useState<any>(null)
  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date().getTime() - 60))
  // const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(new Date().getTime()))
  const [timeLeft, setTimeLeft] = useState<any>(null)
  const [timerComponents, setTimerComponents] = useState<any>(null)
  const [progressValue, setProgressValue] = useState<any>(50)

  const router = useRouter()
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const [{ data, fetching, error }] = useGetCurrentUserQuery()

  const initialize = useCallback(async (preditionContract) => {
    if (!preditionContract) return
    if (epoch) return

    console.log('🚀 HHHHHHHHHHHHHHHHHHHHHH ~ epoch', epoch)
    // if (epoch) return

    const _epoch = epoch ? epoch : await preditionContract.currentEpoch()
    setEpoch(_epoch)

    const {
      // bullAmount,
      // bearAmount,
      // totalAmount,
      // closePrice,
      startTimestamp,
      lockTimestamp,
      // closeTimestamp,
      // lockPrice,
      // startBlock,
      // endBlock,
    } = await preditionContract.rounds(_epoch)

    const _timeLeft = calculateTimeLeft(startTimestamp.toString())
    setTimeLeft(_timeLeft)
    // console.log('🚀 ~ file: index.tsx ~ line 125 ~ initialize ~ _timeLeft', _timeLeft)
    const total = 5 * 60
    const actual = total - _timeLeft
    const generated = (actual * 100) / total
    console.log('🚀 ~ total', 100 - generated)
    setProgressValue(100 - generated)

    enqueueSnackbar(t(`[LAUNCH] Stated to listen contract, current epoch is ${_epoch}`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })

    try {
      preditionContract.on('StartRound', roundStartListenner)
      preditionContract.on('EndRound', roundEndListenner)
      preditionContract.on('BetBull', betBullListenner)
      preditionContract.on('BetBear', betBearListenner)
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
      console.log('🚀 ~ LOADING gameData')
      const round = await loadGameData({ epoch: _epoch })
      if (!round) return

      console.log('🚀 ~  checkEpoch ~ round', round)
      console.log('🚀 ~  checkEpoch ~ bets', round.bets.length)
      // setRound(round)
      round.bets.map((bet) => {
        if (bet.position === 'Bull') {
          userBulls.unshift({ betBull: true, address: bet.id, amount: bet.amount, epoch: _epoch })
          setUserBulls(userBulls)
          // setUserBulls([...userBulls])
        } else if (bet.position === 'Bear') {
          userBears.unshift({ betBull: false, address: bet.id, amount: bet.amount, epoch: _epoch })
          setUserBears(userBears)
          // setUserBears([...userBears])
        }
      })
      enqueueSnackbar(t(`[SYNC] Syncronising with actual round data done`), {
        variant: 'success',
        TransitionComponent: Zoom,
      })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(t(`[ERROR] Error when getting smart contract round data. Starting colleting data from now`), {
        variant: 'error',
        TransitionComponent: Zoom,
      })
    }
  }, [])

  const betBullListenner = async (sender, epoch, amount) => {
    const player = userBulls.find((p) => p.sender === sender)
    if (!player) {
      userBulls.unshift({ betBull: true, address: sender, amount: ethers.utils.formatEther(amount), epoch })
      setUserBulls([...userBulls])
      // console.log(`[BET-BULL] for player ${sender} - ${userBulls.length}`)
      const _timeLeft = calculateTimeLeft(timeLeft)
      // setTimeLeft(_timeLeft)
      const total = 5 * 60
      const actual = total - _timeLeft
      const generated = (actual * 100) / total
      console.log('🚀 ~ total', 100 - generated)
      setProgressValue(100 - generated)
    }
  }

  const betBearListenner = async (sender, epoch, amount) => {
    const player = userBears.find((p) => p.sender === sender)
    if (!player) {
      userBears.unshift({ betBull: false, address: sender, amount: ethers.utils.formatEther(amount), epoch })
      setUserBears([...userBears])
      // console.log(`[BET-BEAR] for player ${sender} - ${userBears.length}`)
      // const _timeLeft = calculateTimeLeft(new Date().getTime())
      const _timeLeft = calculateTimeLeft(timeLeft)
      // setTimeLeft(_timeLeft)
      console.log('🚀 ~ file: index.tsx ~ line 125 ~ initialize ~ _timeLeft', _timeLeft)
      const total = 5 * 60
      const actual = total - _timeLeft
      const generated = (actual * 100) / total
      console.log('🚀 ~ total', 100 - generated)
      setProgressValue(100 - generated)
    }
  }

  const roundStartListenner = async (epoch) => {
    console.log(`[ROUND] Round started for epoch ${+epoch}`)
    enqueueSnackbar(t(`[ROUND] Round started for epoch ${+epoch}`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })
    // setUserBulls([])
    // setUserBears([])
    // await utils.sleep(30 * 1000)
    setEpoch(epoch)
    const timeLeft = calculateTimeLeft(new Date().getTime())
    setTimeLeft(timeLeft)
  }

  const roundEndListenner = async (epoch) => {
    console.log(`[ROUND] Round finished for epoch ${+epoch}`)
    enqueueSnackbar(t(`[ROUND] Round finished for epoch ${+epoch}`), {
      variant: 'success',
      TransitionComponent: Zoom,
    })

    // await utils.sleep(10 * 1000)
    setUserBulls([])
    setUserBears([])
    userBulls.length = 0
    userBears.length = 0
  }

  useEffect(() => {
    if (!data) return
    if (!data.currentUser) {
      router.push('/app')
      return
    }

    if (isMountedRef.current) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)

      // TODO decode from server
      // const privateKey = crpyto.decrypt(data.currentUser.private)
      const privateKey = data.currentUser.private

      const signer = new ethers.Wallet(privateKey, provider)

      setUser(data.currentUser)
      const preditionContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_PANCAKE_PREDICTION_CONTRACT_ADDRESS,
        PREDICTION_CONTRACT_ABI,
        signer
      )
      setPreditionContract(preditionContract)
      initialize(preditionContract)
    }
  }, [data, initialize])

  // const getUsers = useCallback(async () => {
  //         if (isMountedRef.current && data) {
  //     const preditionContract = new ethers.Contract(
  //       process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
  //       PREDICTION_CONTRACT_ABI,
  //       signer
  //     )
  //         }

  // }, [isMountedRef])

  // useEffect(() => {
  //   getUsers()
  // }, [getUsers])

  return (
    <>
      <Head>
        <title>Play live</title>
      </Head>
      <Box sx={{ mt: 1 }}>
        <LinearProgressWrapper variant="buffer" value={progressValue} valueBuffer={80} />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item lg={8} xs={12}>
            <ActiveLiveBets timeLeft={timeLeft} epoch={epoch} userBulls={userBulls} userBears={userBears} />
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
