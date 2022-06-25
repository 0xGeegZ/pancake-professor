const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')
const { loadPlayers } = require('../../../graphql/loadPlayers')
const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

const { sleep, range, finder } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

// const run = async (payload) => {
const run = async () => {
  const blockNativeOptions = {
    dappId: process.env.BLOCKNATIVE_API_KEY_LimonX,
    networkId: +process.env.BINANCE_SMART_CHAIN_ID,
    ws: WebSocket,
    onerror: (error) => {
      logger.error(error)
    },
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const strategie = await prisma.strategie.findUnique({
    where: {
      id: 'cl41i7emy6408v19k7z5dytih',
    },
  })

  if (!strategie) throw new Error('No strategie given')

  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  if (!user) throw new Error('No user given')

  // const { user, strategie } = payload
  let preditionContract
  let signer
  let emitter
  let players = []

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  // if (strategie.running) throw new Error('Strategie is already running')

  logger.info(
    `[LAUNCHING] Job launching job MULTIPLE PLAYER for strategie ${strategie.id} and address ${strategie.generated}`
  )

  let blocknative = new BlocknativeSdk(blockNativeOptions)

  const optimizeBetAmount = () => {
    /* OPTIMIZE STRATEGIE BET AMOUNT */
    if (strategie.currentAmount > strategie.stepBankroll * 1.2) {
      const newBetAmount = parseFloat(strategie.betAmount * 1.1).toFixed(4)
      logger.info(`[OPTIMIZE] Increasing bet amount from ${strategie.betAmount} to ${newBetAmount}`)
      strategie.betAmount = newBetAmount
      strategie.stepBankroll = strategie.currentAmount
    }

    if (strategie.currentAmount < strategie.stepBankroll / 1.2) {
      const newBetAmount = parseFloat(strategie.betAmount / 1.1).toFixed(4)
      logger.info(`[OPTIMIZE] Decreasing bet amount from ${strategie.betAmount} to ${newBetAmount}`)
      strategie.betAmount = newBetAmount
      strategie.stepBankroll = strategie.currentAmount
    }
    /* OPTIMIZE STRATEGIE BET AMOUNT */
  }

  const checkIfClaimable = async (epoch) => {
    try {
      const [claimable, refundable, { claimed, amount }] = await Promise.all([
        preditionContract.claimable(epoch, signer.address),
        preditionContract.refundable(epoch, signer.address),
        preditionContract.ledger(epoch, signer.address),
      ])

      return {
        epoch,
        isPlayed: amount.toString() !== '0',
        isClaimable: (claimable || refundable) && !claimed && amount.toString() !== '0',
        // isWon: claimable || refundable || (amount.toString() !== "0" && claimed)
        isWon: claimable || refundable || claimed,
      }
    } catch (error) {
      logger.error(`[CLAIM] checkIfClaimable error for user ${user.id} and epoch ${epoch}`)
      return {
        epoch,
        isPlayed: false,
        isClaimable: false,
        isWon: false,
      }
    }
  }

  const claimPlayedEpochs = async (epochs) => {
    logger.info(`[CLAIM] try to claim ${epochs.length} epochs : ${epochs}`)

    const claimables = await Promise.all(epochs.map(checkIfClaimable))

    const played = claimables.filter((c) => c.isPlayed)

    const wins = played.filter((c) => c.isWon)?.length

    const losss = played.filter((c) => !c.isWon)?.length

    logger.info(
      `[WIN/LOSS] Win/Loss ratio for player ${strategie.generated} and ${
        claimables.length
      } last games : ${wins}W/${losss}L for ${played.length} played games (${parseFloat(
        (wins * 100) / played.length
      ).toFixed(2)}% Winrate) `
    )

    const claimablesEpochs = claimables.filter((c) => c.isClaimable).map((c) => c.epoch)

    if (claimablesEpochs.length === 0) return logger.info('[CLAIM] Nothing to claim')

    logger.info(`[CLAIM] claimables epochs : ${claimablesEpochs}`)

    // TODO v0.0.4 use it in all strategie
    const gasLimit = config.HEXLIFY_SAFE + config.HEXLIFY_SAFE * Math.round(claimablesEpochs.length / 5)

    const tx = await preditionContract.claim(claimablesEpochs, {
      // gasLimit: ethers.utils.hexlify(config.HEXLIFY_SAFE),
      gasLimit: ethers.utils.hexlify(gasLimit),
      gasPrice: ethers.utils.parseUnits(config.SAFE_GAS_PRICE.toString(), 'gwei').toString(),
      nonce: provider.getTransactionCount(strategie.generated, 'latest'),
    })

    try {
      await tx.wait()
      // //Wait for last transaction to be proceed.
      // await sleep(10 * 1000)
    } catch (error) {
      logger.error(`[CLAIM] Claim Tx Error for user ${user.id} and epochs ${claimablesEpochs}`)
      logger.error(error.message)
    }
  }

  const stopStrategie = async ({ epoch }) => {
    logger.error(`[PLAYING] Stopping strategie ${strategie.id} for user ${user.id}`)

    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        isError: true,
        isActive: false,
        isRunning: false,
      },
    })
    if (emitter) emitter.off('txPool')

    if (epoch) {
      const lastEpochs = [...range(+epoch - 12, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    }
    //TODO reactivate for production
    process.exit(0)
  }
  // const betRound = async ({ epoch, betBull, betAmount, isAlreadyRetried = false }) => {
  const betRound = async ({ epoch, betBull, betAmount, isAlreadyRetried = false }) => {
    if (strategie.currentAmount === 0) {
      logger.error('[PLAYING] Not enought BNB')
      await stopStrategie({ epoch })
    }

    if (betAmount < config.MIN_BET_AMOUNT) betAmount = config.MIN_BET_AMOUNT

    if (betAmount > config.MAX_BET_AMOUNT) betAmount = config.MAX_BET_AMOUNT

    const amount = parseFloat(betAmount).toFixed(4)
    const betBullOrBear = betBull ? 'betBull' : 'betBear'

    if (!(+amount != 0)) {
      logger.error('[PLAYING] Bet amount is 0')
      await stopStrategie({ epoch })
    }

    let isError = false
    try {
      // const gasPrice = await provider.getGasPrice()

      const tx = await preditionContract[betBullOrBear](epoch.toString(), {
        value: ethers.utils.parseEther(amount),
        // nonce: new Date().getTime(),
        nonce: strategie.nonce,
        gasPrice: strategie.gasPrice,
        gasLimit: strategie.gasLimit,
        // gasPrice: ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString(),
        // gasLimit: ethers.utils.hexlify(250000),
        // gasPrice,
      })

      await tx.wait()

      strategie.playedEpochs.push(epoch.toString())
      strategie.playsCount += 1
      strategie.errorCount = 0
    } catch (error) {
      logger.error(`[PLAYING] Betting Tx Error for adress ${strategie.generated} and epoch ${epoch}`)
      logger.error(error.message)

      // Try to reenter
      const { startTimestamp, lockTimestamp } = await preditionContract.rounds(epoch)

      const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

      const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

      const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
      const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

      console.log('🚀  ~ secondsLeft', secondsLeft)

      if (secondsLeft >= 7 && isAlreadyRetried === false) {
        strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')

        return await betRound({ epoch, betBull, betAmount, isAlreadyRetried: true })
      } // else {
      //   strategie.playsCount += 1
      // }
      isError = true
      strategie.errorCount += 1
    }
    // TODO save bet to database
    // const bet = { epoch, betBull, betAmount, isError, strategieId: strategie.id, userId : user.id, hash : strategie.playedHashs[strategie.playedHashs.lenght-1], isClaimed : false}
  }

  const playRound = async ({ epoch }) => {
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    logger.info(`********** [ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] PLAYING **********`)

    if (strategie.plays.length === 0)
      return logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] NO USERS PLAYED`)

    // players.map(p => {
    //   blocknative.unsubscribe(p.id)
    // })
    // if (emitter) emitter.off("txPool")

    let betBullCount = strategie.plays.filter((p) => p.betBull)
    let betBearCount = strategie.plays.filter((p) => !p.betBull)

    const totalPlayers = betBullCount.length + betBearCount.length

    let isBullBetter =
      betBullCount.map((p) => +p.player.winRate).reduce((acc, winRate) => acc + winRate, 0) / betBullCount.length || 0
    // let isBullBetter =
    //   betBullCount
    //     .map(p => +p.player.winRate * (+p.player.totalBets / 100))
    //     .reduce((acc, winRate) => acc + winRate, 0) || 0
    // isBullBetter = parseFloat(isBullBetter).toFixed(2)

    const totalBetsForRound = [...betBullCount, ...betBearCount]
      .map((p) => +p.player.totalBets)
      .reduce((acc, num) => acc + num, 0)
    // console.log('🚀 ~ AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', totalBetsForRound)

    //TODO GUIGUI WIP
    let isBullBetterAdjusted =
      betBullCount
        // .map(p => +p.player.winRate * (+p.player.totalBets / 100))
        .map((p) => {
          // const ratio = (+p.player.totalBets / 100).toString().replace('.', '')
          // const multiplier = `${+p.player.totalBets > 1000 ? '2' : '1'}.${ratio}`
          // console.log("🚀 ~ ratio", ratio)
          // console.log("🚀 ~ multiplier", multiplier)
          // OLD VERSION
          // return +p.player.winRate * parseFloat(multiplier).toFixed(4)
          // END OLD VERSION

          // return +p.player.winRate * (+p.player.totalBets / 100)
          // return +p.player.winRate / +p.player.totalBets
          // return +p.player.totalBets / +p.player.winRate
          // return (
          //   +p.player.winRate / +p.player.totalBets +
          //   +p.player.totalBets / +p.player.winRate
          // )
          // TODO v0.0.4 should have bet bear
          const newCoeff = parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound))
          // console.log('🚀 ~ BBBBBBBBBBBBBBBBBBBBBBBB ~ newCoeff', newCoeff)
          return newCoeff
        })
        .reduce((acc, winRate) => acc + winRate, 0) / betBullCount.length || 0
    isBullBetterAdjusted = parseFloat(isBullBetterAdjusted).toFixed(2)

    let isBearBetter =
      betBearCount.map((p) => +p.player.winRate).reduce((acc, winRate) => acc + winRate, 0) / betBearCount.length || 0
    // let isBearBetter =
    //   betBearCount
    //     .map(p => +p.player.winRate * (+p.player.totalBets / 100))
    //     .reduce((acc, winRate) => acc + winRate, 0) || 0
    // isBearBetter = parseFloat(isBearBetter).toFixed(2)

    let isBearBetterAdjusted =
      betBearCount
        // .map(p => +p.player.winRate * (+p.player.totalBets / 100))
        .map((p) => {
          // const ratio = (+p.player.totalBets / 100).toString().replace('.', '')
          // const multiplier = `${+p.player.totalBets > 1000 ? '2' : '1'}.${ratio}`
          // console.log("🚀 ~ ratio", ratio)
          // console.log("🚀  ~ multiplier", multiplier)
          // OLD VERSION
          // return +p.player.winRate * parseFloat(multiplier).toFixed(4)
          // END OLD VERSION
          // return +p.player.winRate * (+p.player.totalBets / 100)
          // return +p.player.winRate / +p.player.totalBets
          // return +p.player.totalBets / +p.player.winRate
          // return (
          //   +p.player.winRate / +p.player.totalBets +
          //   +p.player.totalBets / +p.player.winRate
          // )
          // TODO v0.0.4 should have bet bear
          const newCoeff = parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound))
          // console.log('🚀 ~ BBBBBBBBBBBBBBBBBBBBBBBB ~ newCoeff', newCoeff)
          return newCoeff
        })
        .reduce((acc, winRate) => acc + winRate, 0) / betBearCount.length || 0
    isBearBetterAdjusted = parseFloat(isBearBetterAdjusted).toFixed(2)

    const isDifferenceAdjustedEfficient =
      +isBullBetterAdjusted > +isBearBetterAdjusted
        ? +isBullBetterAdjusted - +isBearBetterAdjusted
        : +isBearBetterAdjusted - +isBullBetterAdjusted

    // logger.info(
    //   `[ROUND-${
    //     user.id
    //   }:${strategie.roundsCount}:${+epoch}] Last game results : lastBullsCount ${lastBullsCount}  lastBearsCount ${lastBearsCount}`
    // )

    // && isDifferenceAdjustedEfficient >= 30
    // if (
    //   !isSecureMode &&
    //   (lastBullsCount > lastBearsCount || +isBullBetterAdjusted >= 65) &&
    //   ((totalPlayers > 1 && +isBullBetterAdjusted > +isBearBetterAdjusted) ||
    //     (betBullCount === 1 &&
    //       // isBullBetter > 58 &&
    //       // lastBullsCount > lastBearsCount) ||
    //       +isBullBetter >= 59 &&
    //       +isBullBetterAdjusted > +isBearBetterAdjusted))
    //   // // +isBullBetter > +isBearBetter &&
    //   // // lastBullsCount > lastBearsCount
    //   // (lastBullsCount > lastBearsCount || +isBullBetterAdjusted > 150)
    // ) {
    //   console.log(
    //     "///////////////////////// BULL /////////////////////////////////"
    //   )
    //    await betRound(epoch, true, BET_AMOUNT)
    //   data.position = POSITION_BULL
    //   data.isPlaying = true
    //   console.log("//////////////////////////////////////////////////////////")
    // } else if (
    //   !isSecureMode &&
    //   // (lastBearsCount > lastBullsCount || +isBearBetterAdjusted > 80) &&
    //   (lastBearsCount > lastBullsCount || +isBearBetterAdjusted >= 65) &&
    //   ((totalPlayers > 1 && +isBearBetterAdjusted > +isBullBetterAdjusted) ||
    //     (totalPlayers === 1 &&
    //       // isBearBetter > 58 &&
    //       // lastBearsCount > lastBullsCount) ||
    //       +isBearBetter >= 59 &&
    //       +isBearBetterAdjusted > +isBullBetterAdjusted))
    //   // // +isBearBetter > +isBullBetter &&
    //   // // lastBearsCount > lastBullsCount
    //   // (lastBearsCount > lastBullsCount || +isBearBetterAdjusted > 150)
    // ) {
    //   console.log(
    //     "////////////////////////// BEAR ////////////////////////////////"
    //   )
    //    await betRound(epoch, false, BET_AMOUNT)
    //   data.position = POSITION_BEAR
    //   data.isPlaying = true
    //   console.log("//////////////////////////////////////////////////////////")
    // } else

    //TODO GUIGUI WIP
    if (
      // isSecureMode &&
      // totalPlayers > 1 &&
      (totalPlayers > 1 || Math.round(+isBullBetter) >= 57) &&
      // (totalPlayers > 1 || Math.round(+isBullBetter) >= 56) &&
      betBullCount.length >= betBearCount.length &&
      +isBullBetterAdjusted > +isBearBetterAdjusted
      // (+isBullBetterAdjusted > +isBearBetterAdjusted ||
      //   Math.round(+isBullBetter) > Math.round(+isBearBetter))
      // ||
      // (Math.round(+isBullBetter) === Math.round(+isBearBetter) &&
      //   +isBullBetterAdjusted / 2 > +isBearBetterAdjusted))
      //OLD
      // &&
      // Math.round(+isBullBetter) >= Math.round(+isBearBetter)
      // &&
      // lastBullsCount > lastBearsCount
      // &&
      // isDifferenceAdjustedEfficient >= 3 &&
      // // +isBullBetter > +isBearBetter &&
      // // lastBullsCount > lastBearsCount
      // (lastBullsCount > lastBearsCount ||
      //   +isBullBetterAdjusted >= 70 ||
      //   lastBearsCount === 0)
    ) {
      logger.info('///////////////////////// BULL /////////////////////////////////')
      await betRound({ epoch, betBull: true, betAmount: strategie.betAmount })
      logger.info('//////////////////////////////////////////////////////////')
    } else if (
      // isSecureMode &&
      // totalPlayers > 1 &&
      (totalPlayers > 1 || Math.round(+isBearBetter) >= 57) &&
      // (totalPlayers > 1 || Math.round(+isBearBetter) >= 56) &&
      betBearCount.length >= betBullCount.length &&
      +isBearBetterAdjusted > +isBullBetterAdjusted
      // (+isBearBetterAdjusted > +isBullBetterAdjusted ||
      //   Math.round(+isBearBetter) > Math.round(+isBullBetter))
      // ||
      // (Math.round(+isBearBetter) === Math.round(+isBullBetter) &&
      //   +isBearBetterAdjusted / 2 > +isBullBetterAdjusted))
      //OLD
      //  &&
      // Math.round(+isBearBetter) >= Math.round(+isBullBetter)
      // &&
      // lastBearsCount > lastBullsCount
      // &&
      // isDifferenceAdjustedEfficient >= 3 &&
      // // +isBearBetter > +isBullBetter &&
      // // lastBearsCount > lastBullsCount
      // (lastBearsCount > lastBullsCount ||
      //   +isBearBetterAdjusted >= 70 ||
      //   lastBullsCount === 0)
    ) {
      logger.info('////////////////////////// BEAR ////////////////////////////////')
      await betRound({ epoch, betBull: false, betAmount: strategie.betAmount })
      logger.info('//////////////////////////////////////////////////////////')
    } else logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] NOT PLAYING`)

    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] PLAYING : betBullCount ${
        betBullCount.length
      }, betBearCount ${betBearCount.length} - totalPlayers ${totalPlayers}`
    )

    logger.info(
      `[ROUND-${user.id}:${
        strategie.roundsCount
      }:${+epoch}] PLAYING : isBullBetterAdjusted ${isBullBetterAdjusted}, isBearBetterAdjusted ${isBearBetterAdjusted} --> isDifferenceAdjustedEfficient ${isDifferenceAdjustedEfficient}`
    )

    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] (isBullBetter ${Math.round(
        isBullBetter
      )}, isBearBetter ${Math.round(isBearBetter)})`
      // }:${strategie.roundsCount}:${+epoch}] (isBullBetter ${isBullBetter}, isBearBetter ${isBearBetter})`
    )

    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

    players.map((p) => {
      blocknative.unsubscribe(p.id)
    })
    if (emitter) emitter.off('txPool')
    logger.info(`[INFO] Listenning adresses stopped`)
  }

  const processRound = async (transaction, player) => {
    const epoch = await preditionContract.currentEpoch()

    // logger.info(`[LISTEN] Transaction pending detected for player ${player.id} and epoch ${epoch}`)

    if (transaction.from.toLowerCase() !== player.id) {
      // logger.error(`[LISTEN] Incoming transaction.`)
      return
    }

    if (transaction.to.toLowerCase() !== process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS) {
      // logger.info(`[LISTEN] Not a transaction with pancake contract.`)
      return
    }

    if (
      !transaction.input.includes(config.BET_BULL_METHOD_ID) &&
      !transaction.input.includes(config.BET_BEAR_METHOD_ID)
    ) {
      // logger.info(`[LISTEN] Not a bull or bear transaction.`)
      return
    }

    if (transaction.input.includes(config.CLAIM_BEAR_METHOD_ID)) {
      // logger.info(`[LISTEN] Claim transaction.`)
      return
    }

    if (strategie.playedHashs.includes(transaction.hash)) {
      logger.info(`[LISTEN] Already played transaction hash.`)
      return
    }

    // logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)

    // TODO DECODE FUNCTION (see pending.js)
    const betBull = transaction.input.includes(config.BET_BULL_METHOD_ID)

    const isAlreadyTracked = strategie.plays.find((p) => p.player.id === player.id)
    if (!isAlreadyTracked) {
      strategie.plays.push({ betBull, player })
      strategie.playedHashs.push(transaction.hash)

      logger.info(`[LISTEN] Transaction pending detected for player ${player.id} and epoch ${epoch}`)

      logger.info(
        `[LISTEN] Player Betting on ${betBull ? 'BULL' : 'BEAR'} with ${parseFloat(player.winRate).toFixed(
          2
        )}% winRate and ${player.totalBets} bets.`
      )

      logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)
    } else {
      logger.error(`[LISTEN] Already played transaction hash brow.`)
      return
    }
  }

  const roundStartListenner = async (epoch) => {
    const start = Date.now()
    logger.info(`[ROUND:${+epoch}:${user.id}:${strategie.roundsCount}] Round started for epoch ${+epoch}`)

    logger.info(`[ROUND:${+epoch}:${user.id}:${strategie.roundsCount}] Reloading players for epoch ${+epoch}`)

    players.map((p) => {
      blocknative.unsubscribe(p.id)
    })
    if (emitter) emitter.off('txPool')

    strategie.plays = []
    strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')

    // players = await loadPlayers({ epoch, orderBy: 'default' })
    players = await loadPlayers({ epoch, orderBy: 'mostActiveLastHour' })
    const allPlayers = players?.length
    players = players.filter((player) => Math.round(+player.winRateRecents) >= 50)
    // const filtereds = players.filter((player) => Math.round(+player.winRateRecents) >= 50)

    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] Reloaded ${
        players?.length
      }/${allPlayers} players for user ${strategie.generated}`
    )
    // TODO test next line, see https://github.com/blocknative/sdk/issues/187
    // blocknative.destroy()
    // blocknative = new BlocknativeSdk(blockNativeOptions)
    await Promise.all(players.map(waitForTransaction))

    // const stop = Date.now()
    // const executionTime = parseFloat((stop - start) / 1000).toFixed(2)
    // const secondsLeftUntilNextEpoch = 60 * 5 - executionTime

    // const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
    // const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

    // logger.info(
    //   `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] time left ${minutesLeft} minuts ${secondsLeft} seconds`
    // )

    // // TODO v0.0.4
    // // const timer = secondsLeftUntilNextEpoch - 20
    // // const timer = secondsLeftUntilNextEpoch - 15
    // // const timer = secondsLeftUntilNextEpoch - 14
    // const timer = secondsLeftUntilNextEpoch - 12

    const { startTimestamp } = await preditionContract.rounds(epoch)

    const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

    const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

    const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
    const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] time left ${minutesLeft} minuts ${secondsLeft} seconds`
    )

    // TODO v0.0.4
    // const timer = secondsLeftUntilNextEpoch - 15
    // const timer = secondsLeftUntilNextEpoch - 10
    // const timer = secondsLeftUntilNextEpoch - 9 // works
    // const timer = secondsLeftUntilNextEpoch - 8.5 // error
    const timer = secondsLeftUntilNextEpoch - 8.5

    logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] Waiting ${timer} seconds to play epoch ${epoch}`)

    await sleep(timer * 1000)
    logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] timer ended, playing round`)

    await playRound({ epoch })
  }

  const roundEndListenner = async (epoch) => {
    strategie.roundsCount += 1

    const currentAmountBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

    logger.info(
      `[ROUND:${+epoch}:${user.id}:${strategie.roundsCount}] Round finished for epoch ${+epoch} : played ${
        strategie.playsCount
      }/${strategie.roundsCount} games. Current bankroll amount ${strategie.currentAmount}`
    )

    if (strategie.roundsCount % 5 === 0 && strategie.playedEpochs.length >= 1) {
      const lastEpochs = [...range(+epoch - 5, +epoch)]
      // await claimPlayedEpochs([...new Set([...lastEpochs, ...strategie.playedEpochs])])
      await claimPlayedEpochs(lastEpochs)

      //wait for all transactions to completes
      // avoid error for stop loss if claim a lot of amount
      await sleep(10 * 1000)
      strategie.playedEpochs = []
    }
    // if (strategie.playedEpochs.length >= 3) {
    // await claimPlayedEpochs(strategie.playedEpochs)
    // strategie.playedEpochs = []
    // }

    // TODO REACTIVATE AFTER TEST
    // optimizeBetAmount()

    const isUpdatedStrategie = await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        currentAmount: strategie.currentAmount,
        playsCount: strategie.playsCount,
        roundsCount: strategie.roundsCount,
      },
    })

    // Check if stop loss or take profit
    // if (strategie.currentAmount <= isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount) {
    //   logger.info(
    //     `[PLAYING] Stop Loss activated for player ${user.id} : current amount ${
    //       strategie.currentAmount
    //     } --> STOP LOSS : ${isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount}`
    //   )
    //   await stopStrategie({ epoch })
    // }

    // if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
    //   logger.info(
    //     `[PLAYING] Take Profit activated for player ${user.id} : current amount ${strategie.currentAmount} --> TAKE PROFIT : ${isUpdatedStrategie.minWinAmount}`
    //   )
    //   await stopStrategie({ epoch })
    // }

    if (strategie.errorCount >= 5) {
      logger.error('[PLAYING] Strategie had 5 error consecutively. Stopping it.')
      await stopStrategie({ epoch })
    }

    // if (isUpdatedStrategie.isNeedRestart) {
    //   logger.error('[PLAYING] Strategie need to be restarted.')
    //   await prisma.strategie.update({
    //     where: { id: strategie.id },
    //     data: {
    //       isNeedRestart: false,
    //     },
    //   })
    //   logger.error('[PLAYING] RESTARTING STRATEGIE')
    //   process.exit(0)
    // }

    // if (!isUpdatedStrategie.isActive || isUpdatedStrategie.isError || isUpdatedStrategie.isDeleted) {
    //   logger.error('[PLAYING] Strategie was updated by user (stopped or deleted) and need to be stoped.')
    //   await stopStrategie({ epoch })
    // }
  }

  // const checkIfPlaying = (player, lastGame) => {
  //   let results = player.bets
  //     .map(({ position, round: { epoch, position: final } }) => {
  //       return { epoch: +epoch, isWon: position === final }
  //     })
  //     .sort((a, b) => a.epoch > b.epoch)

  //   results = results.sort((a, b) => +a.epoch - +b.epoch)

  //   let recentGames = finder(
  //     lastGame,
  //     results.map((r) => r.epoch)
  //   )

  //   recentGames = recentGames.reduce((a, b) => a + b, 0)
  //   player.recentGames = recentGames

  //   let lastLooseCountForPlayer = 0
  //   for (let i = results.length - 1; i >= 0; i--) {
  //     if (!results[i].isWon && lastGame.includes(results[i].epoch)) lastLooseCountForPlayer++
  //     else break
  //   }
  //   player.lastLooseCount = lastLooseCountForPlayer

  //   let lastFive = finder(
  //     lastGame.slice(Math.max(lastGame.length - 5, 0)),
  //     results.map((r) => r.epoch)
  //   )
  //   lastFive = lastFive.reduce((a, b) => a + b, 0)
  //   player.lastFive = lastFive

  //   const filtereds = results.filter((r) => lastGame.includes(r.epoch))
  //   const wons = filtereds.filter((r) => r.isWon)
  //   winRateRecents = (wons.length * 100) / filtereds.length || 0
  //   player.winRateRecents = winRateRecents
  //   // console.log("🚀 ~ filtereds", filtereds)
  //   // console.log(
  //   //   "🚀 ~ winRateRecents",
  //   //   winRateRecents,
  //   //   "player winRate",
  //   //   player.winRate,
  //   //   " filtereds",
  //   //   filtereds.length,
  //   //   "wons",
  //   //   wons.length
  //   // )

  //   //TODO check last 10 AND last 5
  //   // delete player.bets

  //   // const found = epochs.some(r => lastGame.indexOf(r) >= 0)
  //   // if (found) return player

  //   // if (recentGames >= 1) return player
  //   // if (recentGames >= 1 && winRateRecents >= 30) return player
  //   // if (recentGames >= 1 && winRateRecents >= 40) return player
  //   // if (recentGames >= 4) return player
  //   // if (recentGames >= lastGame.length / 3) return player

  //   // if (recentGames >= lastGame.length / 3) return player
  //   // if (recentGames >= lastGame.length / 4 && lastFive > 0) return player
  //   //TODO GUIGUI WIP
  //   // if (lastFive > 0) return player

  //   //V1
  //   if (recentGames >= lastGame.length / 4 && lastFive > 1) return player

  //   // return player
  // }

  // const loadPlayers = async () => {
  //   try {
  //     //TODO USE VAR FOR WINRATE TO DECREASE IT IF NO PLAYER
  //     const query = gql`
  //       query getUsers($totalBets: String!, $winRate: String!) {
  //         users(
  //           first: 1000
  //           # where: { totalBets_gt: "80", winRate_gt: "56" }
  //           where: { totalBets_gt: $totalBets, winRate_gt: $winRate }
  //           # where: { totalBets_gt: "80", winRate_gt: "58" }
  //           # where: { totalBets_gt: "80", winRate_gt: "55" }
  //           # where: { totalBets_gt: "80", winRate_gt: "54" }
  //           # where: { totalBets_gt: "80", winRate_gt: "52" }
  //           # where: { netBNB_gt: "0", totalBets_gt: "100", winRate_gt: "52" }
  //           orderBy: winRate
  //           orderDirection: desc
  //         ) {
  //           id
  //           totalBNB
  //           totalBets
  //           winRate
  //           averageBNB
  //           netBNB
  //           bets(first: 1000, orderBy: createdAt, orderDirection: desc) {
  //             # bets(orderBy: createdAt, orderDirection: desc) {
  //             position
  //             round {
  //               epoch
  //               position
  //             }
  //           }
  //           # bets {
  //           #   round {
  //           #     epoch
  //           #   }
  //           # }
  //         }
  //       }
  //     `

  //     const lastFinishedEpoch = parseInt(await preditionContract.currentEpoch()) - 1

  //     const variables = {
  //       totalBets: config.TOTAL_BETS.toString(),
  //       winRate: config.WIN_RATE.toString(),
  //     }
  //     let data = await graphQLClient.request(query, variables)

  //     const { users } = data

  //     logger.info(
  //       `Loading ${+users.length} players with config.WIN_RATE ${config.WIN_RATE} and config.TOTAL_BETS ${
  //         config.TOTAL_BETS
  //       } ...`
  //     )

  //     const lastGame = [
  //       // ...range(lastFinishedEpoch - LIMIT_HISTORY_LENGTH, lastFinishedEpoch)
  //       ...range(lastFinishedEpoch - 12, lastFinishedEpoch),
  //     ]
  //     let bestPlayers = users.map((p) => checkIfPlaying(p, lastGame))

  //     bestPlayers = bestPlayers.filter(Boolean)

  //     //TODO GUIGUI WIP
  //     bestPlayers = bestPlayers.filter(
  //       // V1
  //       // p =>
  //       //   // +p.lastLooseCount > 0 &&
  //       //   +p.lastLooseCount <= 1 &&
  //       //   Math.round(+p.winRateRecents) <= Math.round(+p.winRate)

  //       // V2
  //       // p => +p.winRateRecents < +p.winRate

  //       // V3
  //       // p =>
  //       //   +p.lastLooseCount <= 0 &&
  //       //   Math.round(+p.winRateRecents) >= Math.round(+p.winRate)

  //       //TEST
  //       // p => +p.lastLooseCount >= 1 && +p.lastLooseCount <= 2
  //       // p => +p.lastLooseCount === 0
  //       (p) => +p.lastLooseCount === 0 && +p.lastWinCount < 4
  //     )

  //     //V0
  //     // bestPlayers = bestPlayers.filter(
  //     //   p =>
  //     //     +p.lastLooseCount <= 2 &&
  //     //     +p.winRateRecents >= 30
  //     //     // &&
  //     //     // +p.winRateRecents < +p.winRate
  //     // )
  //     // console.log(
  //     //   "🚀 ~ file: copy-best-players.js ~ line 991 ~ loadPlayers ~ bestPlayers",
  //     //   bestPlayers
  //     // )

  //     // bestPlayers = bestPlayers.filter(
  //     //   // p => +p.winRateRecents > 50 && p.recentGames > 1
  //     //   // p => +p.winRateRecents >= 50
  //     //   p => +p.winRateRecents >= 50 && +p.winRateRecents < 100
  //     //   // p => +p.winRateRecents >= 35 && p.recentGames > 1
  //     // )
  //     // bestPlayers = bestPlayers.filter(p => +p.winRateRecents >= 50)
  //     // bestPlayers = bestPlayers.filter(p => +p.winRate > 54)
  //     bestPlayers = bestPlayers.filter((p) => !alreadyPlayeds.includes(p.id))

  //     console.log('🚀 ~ file: index.js ~ line 783 ~ querygetUsers ~ bestPlayers', bestPlayers.length)

  //     // if (isFavoritBestPlayers)
  //     //   bestPlayers = bestPlayers.filter(p => !UNFAVORITE_PLAYERS.includes(p.id))

  //     // if (bestPlayers.length === 0) {
  //     if (bestPlayers.length <= 2) {
  //       alreadyPlayeds = []
  //       if (config.WIN_RATE < 54) {
  //         logger.info('Waiting 5 minuts')
  //         await sleep(60 * 1000 * 5)
  //       } else {
  //         if (config.TOTAL_BETS >= 60) {
  //           config.TOTAL_BETS -= 5
  //         } else {
  //           config.WIN_RATE--
  //         }
  //       }
  //       return await loadPlayers()
  //     } else {
  //       config.TOTAL_BETS = config.TOTAL_BETS_INITIAL
  //       config.WIN_RATE = config.WIN_RATE_INITIAL
  //       // alreadyPlayeds = []
  //     }

  //     bestPlayers = bestPlayers.sort(
  //       (a, b) => {
  //         // if (a.recentGames > b.recentGames) return -1
  //         // if (a.recentGames < b.recentGames) return 1
  //         // if (+a.winRate > +b.winRate) return -1
  //         // if (+a.winRate < +b.winRate) return 1

  //         // if (isFavoritBestPlayers && FAVORITE_PLAYERS.includes(a.id)) return -1
  //         // if (isFavoritBestPlayers && FAVORITE_PLAYERS.includes(b.id)) return 1

  //         if (
  //           +a.winRate > +b.winRate &&
  //           (a.recentGames >= b.recentGames + 1 ||
  //             (a.recentGames >= 7 && b.recentGames >= 7 && a.recentGames >= b.recentGames + 2))
  //         )
  //           return -1
  //         if (
  //           +a.winRate < +b.winRate &&
  //           (a.recentGames <= b.recentGames + 1 ||
  //             (a.recentGames <= 7 && b.recentGames <= 7 && a.recentGames <= b.recentGames + 2))
  //         )
  //           return 1

  //         // if (+a.winRate > +b.winRate && a.recentGames >= b.recentGames + 1)
  //         //   return -1
  //         // if (+a.winRate < +b.winRate && a.recentGames <= b.recentGames + 1)
  //         //   return 1

  //         if (+a.winRate > +b.winRate && a.recentGames > b.recentGames) return -1
  //         if (+a.winRate < +b.winRate && a.recentGames < b.recentGames) return 1

  //         if (a.recentGames > b.recentGames) return -1
  //         if (a.recentGames < b.recentGames) return 1

  //         if (+a.winRate > +b.winRate) return -1
  //         if (+a.winRate < +b.winRate) return 1
  //       }
  //       // (a, b) => a.recentGames > b.recentGames && +a.winRate > +b.winRate
  //     )

  //     // console.log("🚀 ~ loadPlayers ~ bestPlayers", bestPlayers)

  //     if (bestPlayers.length === 0) return logger.error('No players finded')

  //     logger.info(`Looking within ${bestPlayers.length} best players to listen to (on top ${users.length}).`)

  //     return bestPlayers
  //   } catch (error) {
  //     console.log('🚀 ~ file: index.js ~ line 855 ~ querygetUsers ~ error', error)
  //     logger.error('GraphQL query error')
  //     await sleep(5 * 1000)
  //     logger.error('Retrying...')
  //     return await loadPlayers()
  //   }
  // }

  const waitForTransaction = async (player) => {
    // logger.info(`[LISTEN] Waiting for transaction from player ${player.id}`)

    // call with the address of the account that you would like to receive status updates for
    const { emitter: emt } = blocknative.account(player.id)
    emitter = emt
    // register a callback for a txPool event
    emitter.on('txPool', (tx) => processRound(tx, player))
    // logger.info(`[LISTEN] emitter is listenning to transaction from mempool`)
  }

  const tryToEnterFast = async () => {
    const currentEpoch = await preditionContract.currentEpoch()

    const { startTimestamp } = await preditionContract.rounds(currentEpoch)

    const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

    const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

    const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
    const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

    logger.info(
      `[ROUND-${user.id}:${
        strategie.roundsCount
      }:${+currentEpoch}] time left ${minutesLeft} minuts ${secondsLeft} seconds`
    )

    // TODO v0.0.4 one block = 3000
    // const timer = secondsLeftUntilNextEpoch - 15
    // const timer = secondsLeftUntilNextEpoch - 10
    // const timer = secondsLeftUntilNextEpoch - 9 // works
    // const timer = secondsLeftUntilNextEpoch - 8.5 // error
    const timer = secondsLeftUntilNextEpoch - 8.5

    if (timer <= 30) {
      players.map((p) => {
        blocknative.unsubscribe(p.id)
      })
      if (emitter) emitter.off('txPool')
      return logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+currentEpoch}] waiting for the next one...`)
    }

    logger.info(
      `[ROUND-${user.id}:${
        strategie.roundsCount
      }:${+currentEpoch}] Waiting ${timer} seconds to play epoch ${currentEpoch}`
    )

    await sleep(timer * 1000)

    logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+currentEpoch}] timer ended, playing round`)

    await playRound({ epoch: currentEpoch })
  }

  const listen = async () => {
    const privateKey = decrypt(strategie.private)
    signer = new ethers.Wallet(privateKey, provider)

    preditionContract = new ethers.Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      config.PREDICTION_CONTRACT_ABI,
      signer
    )

    try {
      await prisma.strategie.update({
        where: { id: strategie.id },
        data: {
          isRunning: true,
        },
      })
      const isPaused = await preditionContract.paused()

      if (isPaused) {
        logger.error(`[ERROR] Contract is paused. Waiting one hour `)

        // waiting one hour
        await sleep(60 * 60 * 1000)
        await prisma.strategie.update({
          where: { id: strategie.id },
          data: {
            isRunning: false,
          },
        })
        process.exit(0)
      }

      const epoch = await preditionContract.currentEpoch()

      const lastEpochs = [...range(+epoch - 12, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    } catch (error) {
      logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    }

    const epoch = await preditionContract.currentEpoch()

    const initialBankrollBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(initialBankrollBigInt)
    strategie.stepBankroll = strategie.startedAmount
    // strategie.betAmount = +(strategie.currentAmount / 15).toFixed(4)
    strategie.betAmount = config.MIN_BET_AMOUNT
    // strategie.betAmount = config.BET_AMOUNT
    // strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)
    strategie.plays = []
    strategie.playedHashs = []
    strategie.playedEpochs = []
    strategie.errorCount = 0

    strategie.gasPrice = ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()
    // strategie.gasLimit = ethers.utils.hexlify(250000)

    // TODO v0.0.4
    strategie.gasLimit = ethers.utils.hexlify(config.HEXLIFY_FAST)
    strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')

    // TODO REACTIVATE AFTER TEST
    // optimizeBetAmount()

    if (strategie.currentAmount <= config.MIN_BET_AMOUNT) {
      logger.error(
        `[LISTEN] Bet amount error, current bankroll is ${strategie.currentAmount} Stopping strategie for now`
      )
      await stopStrategie({ epoch })
      return
    }

    // if (strategie.betAmount <= config.MIN_BET_AMOUNT || strategie.betAmount > config.MAX_BET_AMOUNT) {
    //   logger.error(`[LISTEN] Bet amount error, value is ${strategie.betAmount} Stopping strategie for now`)
    //   await stopStrategie({ epoch })
    //   return
    // }

    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        isRunning: true,
        currentAmount: strategie.currentAmount,
      },
    })

    logger.info(
      `[LISTEN] Stetting up bet amount to ${strategie.betAmount} for initial bankroll ${strategie.currentAmount}.`
    )

    // players = await loadPlayers({ epoch, orderBy: 'default' })
    players = await loadPlayers({ epoch, orderBy: 'mostActiveLastHour' })
    const allPlayers = players?.length
    players = players.filter((player) => Math.round(+player.winRateRecents) >= 50)
    // const filtereds = players.filter((player) => Math.round(+player.winRateRecents) >= 50)

    logger.info(`[LISTEN] Starting for user ${strategie.generated} copy ${players?.length}/${allPlayers} players`)

    await Promise.all(players.map(waitForTransaction))

    preditionContract.on('StartRound', roundStartListenner)
    preditionContract.on('EndRound', roundEndListenner)

    await tryToEnterFast()
  }

  // try {
  await listen()
  // } catch (error) {
  // logger.error(
  //   `[ERROR] Stopping strategie for user ${strategie.generated} copy betting player ${strategie.generated}: ${error}`
  // )
  // await stopStrategie()
  //   throw new Error(error)
  // }
}

module.exports = { run }
