const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')
const { loadPlayers, checkPlayer } = require('../../../graphql/loadPlayers')
const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)

const { sleep, range, finder } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

// const run = async (payload) => {
const run = async () => {
  const blockNativeOptions = {
    dappId: process.env.BLOCKNATIVE_API_KEY,
    networkId: +process.env.BINANCE_SMART_CHAIN_ID,
    ws: WebSocket,
    onerror: (error) => {
      logger.error(error)
    },
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const strategie = await prisma.strategie.findUnique({
    where: {
      id: 'ckwi3ghhh3886ew7x5xqi05pv',
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
  let player

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  // if (strategie.running) throw new Error('Strategie is already running')

  logger.info(
    `[LAUNCHING] Launching job SINGLE PLAYER AUTO for strategie ${strategie.id} and address ${strategie.generated}`
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

    const gasPrice = await provider.getGasPrice()

    const tx = await preditionContract.claim(claimablesEpochs, {
      gasLimit: ethers.utils.hexlify(350000),
      // gasPrice,
      gasPrice: ethers.utils.parseUnits(config.SAFE_GAS_PRICE.toString(), 'gwei').toString(),
      // nonce: provider.getTransactionCount(strategie.generated, 'latest'),
      nonce: new Date().getTime(),
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
        nonce: provider.getTransactionCount(strategie.generated, 'latest'),
        gasPrice: strategie.gasPrice,
        gasLimit: strategie.gasLimit,
        // gasPrice: ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString(),
        // gasLimit: ethers.utils.hexlify(250000),
        // gasPrice,
      })

      await tx.wait()

      strategie.playedEpochs.push(epoch.toString())
      strategie.playsCount += 1
      strategie.playsCountForActualPlayer += 1
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

      if (secondsLeft >= 15 && isAlreadyRetried === false)
        await betRound({ epoch, betBull, betAmount, isAlreadyRetried: true })
      // else {
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

    logger.info(`[INFO] Listenning adresses stopped`)

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

    //TODO GUIGUI WIP
    let isBullBetterAdjusted =
      betBullCount
        // .map(p => +p.player.winRate * (+p.player.totalBets / 100))
        .map((p) => {
          const ratio = (+p.player.totalBets / 100).toString().replace('.', '')
          const multiplier = `${+p.player.totalBets > 1000 ? '2' : '1'}.${ratio}`
          // console.log("🚀 ~ ratio", ratio)
          // console.log("🚀 ~ multiplier", multiplier)
          return +p.player.winRate * parseFloat(multiplier).toFixed(4)
          // return +p.player.winRate * (+p.player.totalBets / 100)
          // return +p.player.winRate / +p.player.totalBets
          // return +p.player.totalBets / +p.player.winRate
          // return (
          //   +p.player.winRate / +p.player.totalBets +
          //   +p.player.totalBets / +p.player.winRate
          // )
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
          const ratio = (+p.player.totalBets / 100).toString().replace('.', '')
          const multiplier = `${+p.player.totalBets > 1000 ? '2' : '1'}.${ratio}`
          // console.log("🚀 ~ ratio", ratio)
          // console.log("🚀  ~ multiplier", multiplier)
          return +p.player.winRate * parseFloat(multiplier).toFixed(4)
          // return +p.player.winRate * (+p.player.totalBets / 100)
          // return +p.player.winRate / +p.player.totalBets
          // return +p.player.totalBets / +p.player.winRate
          // return (
          //   +p.player.winRate / +p.player.totalBets +
          //   +p.player.totalBets / +p.player.winRate
          // )
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
      betBullCount.length > betBearCount.length &&
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
      console.log('///////////////////////// BULL /////////////////////////////////')
      await betRound({ epoch, betBull: true, betAmount: strategie.betAmount })
      console.log('//////////////////////////////////////////////////////////')
    } else if (
      // isSecureMode &&
      // totalPlayers > 1 &&
      (totalPlayers > 1 || Math.round(+isBearBetter) >= 57) &&
      betBearCount.length > betBullCount.length &&
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
      console.log('////////////////////////// BEAR ////////////////////////////////')
      await betRound({ epoch, betBull: false, betAmount: strategie.betAmount })
      console.log('//////////////////////////////////////////////////////////')
    } else logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] NOT PLAYING`)

    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    players.map((p) => {
      blocknative.unsubscribe(p.id)
    })
    if (emitter) emitter.off('txPool')
  }

  const processRound = async (transaction, epoch) => {
    // const epoch = await preditionContract.currentEpoch()

    logger.info(`[LISTEN] Transaction pending detected for playerAddress ${player.id} and epoch ${epoch}`)

    if (transaction.from.toLowerCase() !== strategie.playerData.id) {
      logger.error(`[LISTEN] Incoming transaction.`)
      return
    }

    if (transaction.to.toLowerCase() !== process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS) {
      logger.info(`[LISTEN] Not a transaction with pancake contract.`)
      return
    }

    if (
      !transaction.input.includes(config.BET_BULL_METHOD_ID) &&
      !transaction.input.includes(config.BET_BEAR_METHOD_ID)
    ) {
      logger.info(`[LISTEN] Not a bull or bear transaction.`)
      return
    }

    if (transaction.input.includes(config.CLAIM_BEAR_METHOD_ID)) {
      logger.info(`[LISTEN] Claim transaction.`)
      return
    }

    if (strategie.playedHashs.includes(transaction.hash)) {
      logger.info(`[LISTEN] Already played transaction hash.`)
      return
    }

    logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)

    const betBull = transaction.input.includes(config.BET_BULL_METHOD_ID)

    const { betAmount } = strategie
    // const playerBetAmount = ethers.utils.formatEther(transaction.value)

    // logger.info(`[LISTEN] BetBull ${betBull}, playerBetAmount ${playerBetAmount}`)

    // // Check if less than average
    // if (parseFloat(+playerBetAmount).toFixed(3) < parseFloat(+player.averageBNB).toFixed(3)) {
    //   logger.info('**************************')
    //   logger.info(`[LISTEN] BET AMOUNT IS LESS THAN AVERAGE, not a secure bet. --> Decreasing bet amount value to 30%`)
    //   logger.info('**************************')
    //   betAmount *= 0.7
    //   // return
    // }

    // TODO check if it really good for equity to increase amoung in this case
    //  else if (
    //   parseFloat(+playerBetAmount).toFixed(3) >=
    //   parseFloat(+player.averageBNB * 1.5).toFixed(3)
    // ) {
    //   logger.info("**************************")
    //   logger.info(
    //     `[LISTEN] BET AMOUNT IS MUCH MORE THAN AVERAGE, looks to be a good spot. --> Increasin bet amount value to 25%`
    //   )
    //   logger.info("**************************")
    //   betAmount = betAmount * 1.25
    // }

    logger.info('------------------------------------------------------------')
    logger.info('------------------------------------------------------------')
    logger.info(`[PLAYING] Betting on ${betBull ? 'BULL' : 'BEAR'} with ${betAmount} BNB amount for epoch ${epoch}`)

    strategie.playedHashs.push(transaction.hash)

    await betRound({ epoch, betBull, betAmount })
    logger.info('------------------------------------------------------------')
    logger.info('------------------------------------------------------------')
  }

  const roundStartListenner = async (epoch) => {
    logger.info(`[ROUND:${+epoch}:${user.id}:${strategie.roundsCount}] Round started for epoch ${+epoch}`)

    emitter?.off('txPool')
    await waitForTransaction(epoch)
  }

  const roundEndListenner = async (epoch) => {
    strategie.roundsCount += 1
    strategie.roundsCountForActualPlayer += 1

    const currentAmountBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

    logger.info(
      `[ROUND:${+epoch}:${strategie.playerData.id}:${
        strategie.roundsCount
      }] Round finished for epoch ${+epoch} : played ${strategie.playsCount}/${
        strategie.roundsCount
      } games. Current bankroll amount ${strategie.currentAmount}`
    )

    if (strategie.roundsCount % 5 === 0 && strategie.playedEpochs.length > 1) {
      const lastEpochs = [...range(+epoch - 5, +epoch)]
      // await claimPlayedEpochs(lastEpochs)
      await claimPlayedEpochs([...new Set([...lastEpochs, ...strategie.playedEpochs])])

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

    if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
      logger.info(
        `[PLAYING] Take Profit activated for player ${user.id} : current amount ${strategie.currentAmount} --> TAKE PROFIT : ${isUpdatedStrategie.minWinAmount}`
      )
      await stopStrategie({ epoch })
    }

    if (strategie.errorCount >= 5) {
      logger.error('[PLAYING] Strategie had 5 error consecutively. Stopping it.')
      await stopStrategie({ epoch })
    }

    if (isUpdatedStrategie.isNeedRestart) {
      logger.error('[PLAYING] Strategie need to be restarted.')
      await prisma.strategie.update({
        where: { id: strategie.id },
        data: {
          isNeedRestart: false,
        },
      })
      logger.error('[PLAYING] RESTARTING STRATEGIE')
      process.exit(0)
    }

    // if (!isUpdatedStrategie.isActive || isUpdatedStrategie.isError || isUpdatedStrategie.isDeleted) {
    //   logger.error('[PLAYING] Strategie was updated by user (stopped or deleted) and need to be stoped.')
    //   await stopStrategie({ epoch })
    // }

    const lastEpochs = [...range(+epoch - 12, +epoch)]

    const lastGames = await Promise.all(lastEpochs.map(checkIfClaimable))

    const lastPLayedGame = lastGames.filter((c) => c.isPlayed).sort((a, b) => +a.epoch - +b.epoch)

    strategie.lastLooseCount = 0
    for (let i = lastPLayedGame.length - 1; i >= 0; i--) {
      if (!lastPLayedGame[i].isWon) strategie.lastLooseCount++
      else break
    }

    if (strategie.lastLooseCount === 0) {
      strategie.previousLastLooseCount = strategie.lastLooseCount
      strategie.alreadyPlayeds = []
    }

    const lastFinishedEpoch = +epoch - 1

    const lastGame = [...range(lastFinishedEpoch - 5, lastFinishedEpoch)]

    const isPLaying = !!(await checkPlayer(strategie.playerData.id, lastGame))
    console.log('🚀 ~ ~ lastLooseCount', strategie.lastLooseCount)
    console.log('🚀 ~ previousLastLooseCount', strategie.previousLastLooseCount)
    console.log(
      'playsCount',
      strategie.playsCount,
      'roundsCountForActualPlayer',
      strategie.roundsCountForActualPlayer,
      'isPLaying',
      isPLaying
    )

    if (
      (strategie.playsCount === 0 && strategie.roundsCountForActualPlayer === 2) ||
      (strategie.roundsCountForActualPlayer >= 2 && strategie.lastLooseCount - strategie.previousLastLooseCount >= 2) ||
      !isPLaying
    ) {
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')

      logger.info(
        `[ROUND:${+epoch}:${user.id}:${strategie.roundsCount}] Reloading player with WIN_RATE ${
          config.WIN_RATE
        } and TOTAL_BETS ${config.TOTAL_BETS}...`
      )
      strategie.alreadyPlayeds.push(strategie.playerData.id)
      strategie.previousLastLooseCount = strategie.lastLooseCount

      const oldPlayer = strategie.playerData.id
      const players = await loadPlayers({ epoch, orderBy: 'mostActiveLastHour' })

      logger.info(`[RELOAD] Looking for best player for user ${strategie.generated} from ${players.length} players`)

      const player = findBestPlayer(players)
      if (!player) throw new Error('No player finded')

      strategie.playerData = player

      const newPlayer = player.id

      if (oldPlayer === newPlayer) console.log('SAME PLAYER')
      else console.log('OLD PLAYER', oldPlayer, 'NEW PLAYER', newPlayer)

      strategie.roundsCountForActualPlayer = 0
      strategie.playsCountForActualPlayer = 0
      strategie.playsCount = 0
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    }
  }

  const waitForTransaction = async (epoch) => {
    // logger.info(`[LISTEN] Waiting for transaction from player ${player.id}`)

    // call with the address of the account that you would like to receive status updates for
    const { emitter: emt } = blocknative.account(strategie.playerData.id)
    emitter = emt
    // register a callback for a txPool event
    emitter.on('txPool', (tx) => processRound(tx, epoch))
    // logger.info(`[LISTEN] emitter is listenning to transaction from mempool`)
  }

  const tryToEnterFast = async () => {
    const epoch = await preditionContract.currentEpoch()

    const [currentBet] = strategie.playerData.bets.filter((b) => +b.round.epoch === +epoch)

    delete strategie.playerData.bets

    if (currentBet) {
      const betBull = currentBet.position === 'Bull'
      logger.info(`[PLAYING-CHECK] Player laready play on ${currentBet.position} for current epoch`)

      await betRound({ epoch, betBull, betAmount: strategie.betAmount, isAlreadyRetried: true })
    } else await waitForTransaction(epoch)
    // } else await waitForTransaction(strategie.playerData)
  }

  const findBestPlayer = (bestPlayers) => {
    bestPlayers = bestPlayers.sort((a, b) => {
      // if (isFavoritBestPlayers && FAVORITE_PLAYERS.includes(a.id) && a.lastFive >= 2) return -1
      // if (isFavoritBestPlayers && FAVORITE_PLAYERS.includes(b.id) && b.lastFive >= 2) return 1

      if (
        // Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) >= Math.abs(+b.winRate) &&
        a.lastFive === b.lastFive &&
        a.recentGames > b.recentGames
      )
        return -1

      if (
        // Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) < Math.abs(+b.winRate) &&
        a.lastFive === b.lastFive &&
        a.recentGames < b.recentGames
      )
        return 1

      if (
        // Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) >= Math.abs(+b.winRate) &&
        a.lastFive > b.lastFive &&
        a.recentGames > b.recentGames
      )
        return -1
      if (
        // Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) < Math.abs(+b.winRate) &&
        a.lastFive < b.lastFive &&
        a.recentGames < b.recentGames
      )
        return 1

      if (
        // Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) >= Math.abs(+b.winRate) &&
        a.lastFive === b.lastFive + 1 &&
        a.recentGames >= b.recentGames
        // &&
        // a.lastLooseCount < b.lastLooseCount
      )
        return -1
      if (
        // Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents) &&
        Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents) &&
        // Math.abs(+a.winRate) < Math.abs(+b.winRate) &&
        a.lastFive === b.lastFive + 1 &&
        a.recentGames < b.recentGames
        // &&
        // a.lastLooseCount >= b.lastLooseCount
      )
        return 1

      if (a.lastFive > b.lastFive && a.recentGames > b.recentGames) return -1
      if (a.lastFive < b.lastFive && a.recentGames < b.recentGames) return 1

      // if (Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents)) return -1
      if (Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents)) return -1
      // if (Math.abs(+a.winRate) >= Math.abs(+b.winRate)) return -1
      // if (Math.abs(+a.winRateRecents) >= Math.abs(+b.winRateRecents)) return 1
      if (Math.abs(+a.winRateRecents) < Math.abs(+b.winRateRecents)) return 1
      // if (Math.abs(+a.winRate) < Math.abs(+b.winRate)) return 1
    })

    player = Object.assign({}, bestPlayers[0])

    if (!bestPlayers.length) return logger.error('No player finded')

    for (let i = 0; i < bestPlayers.length; i++) {
      delete bestPlayers[i].bets
    }
    console.log('🚀 ~ file: index.js ~ line 773 ~ bestPlayers=bestPlayers.sort ~ bestPlayers', bestPlayers)

    return player
  }

  const listen = async () => {
    const privateKey = decrypt(strategie.private)
    signer = new ethers.Wallet(privateKey, provider)

    preditionContract = new ethers.Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      config.PREDICTION_CONTRACT_ABI,
      signer
    )

    const epoch = await preditionContract.currentEpoch()

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

      const lastEpochs = [...range(+epoch - 12, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    } catch (error) {
      logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    }

    const initialBankrollBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(initialBankrollBigInt)
    strategie.stepBankroll = strategie.startedAmount
    // strategie.betAmount = +(strategie.currentAmount / 15).toFixed(4)
    strategie.betAmount = config.MIN_BET_AMOUNT
    // strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)

    strategie.playsCount = 0
    strategie.playsCountForActualPlayer = 0
    strategie.roundsCountForActualPlayer = 0
    strategie.previousLastLooseCount = 0
    strategie.lastLooseCount = 0
    strategie.errorCount = 0

    strategie.alreadyPlayeds = []
    strategie.plays = []
    strategie.playedHashs = []
    strategie.playedEpochs = []

    strategie.gasPrice = ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()
    // strategie.gasLimit = ethers.utils.hexlify(250000)
    strategie.gasLimit = ethers.utils.hexlify(350000)

    // TODO REACTIVATE AFTER TEST
    // optimizeBetAmount()

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

    const players = await loadPlayers({ epoch, orderBy: 'mostActiveLastHour' })
    logger.info(`[LISTEN] Looking for best player for user ${strategie.generated} from ${players.length} players`)

    const player = findBestPlayer(players)

    if (!player) throw new Error('No player finded')

    strategie.playerData = player
    logger.info(`[LISTEN] Starting for user ${strategie.generated} copy player ${player.id}`)

    preditionContract.on('StartRound', roundStartListenner)
    preditionContract.on('EndRound', roundEndListenner)

    await tryToEnterFast()
  }

  // try {
  await listen()
  // } catch (error) {
  // logger.error(
  //   `[ERROR] Stopping strategie for user ${strategie.generated} copy betting player ${strategie.player}: ${error}`
  // )
  // await stopStrategie()
  //   throw new Error(error)
  // }
}

module.exports = { run }
