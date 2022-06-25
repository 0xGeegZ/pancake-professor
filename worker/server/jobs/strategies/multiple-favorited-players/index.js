const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')
const { GraphQLClient, gql } = require('graphql-request')
const graphQLClient = new GraphQLClient(process.env.PANCAKE_PREDICTION_GRAPHQL_ENDPOINT)
const { setTimeout } = require('timers/promises')

const { loadPlayer } = require('../../../graphql/loadPlayer')

const { sleep, range, finder } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

const run = async () => {
  const userId = 'cl3n5i8vj0011a59k4fyf2k5h'
  const strategyId = 'cl460tkxr9683os9kpmrv9yki'

  const keys = [
    process.env.BLOCKNATIVE_API_KEY,
    // process.env.BLOCKNATIVE_API_KEY_KISI,
    // process.env.BLOCKNATIVE_API_KEY_GLANUM,
    // process.env.BLOCKNATIVE_API_KEY_LimonX,
  ]
  let key = keys[0]

  const onBlockNativeError = (error) => {
    logger.error(`[BLOCKNATIVE] ERROR : ${error.message}`)
    if (
      error.message ===
      'You have reached your event rate limit for today. See explorer.blocknative.com/account for details.'
    ) {
      const index = keys.indexOf(key)
      let newIndex = index
      if (index >= keys.length - 1) newIndex = 0
      else newIndex += 1

      key = keys[newIndex]
      logger.error(`[BLOCKNATIVE] Key rate limit for today, using another key. old key ${index}, new index ${newIndex}`)
      blockNativeOptions = {
        dappId: key,
        networkId: +process.env.BINANCE_SMART_CHAIN_ID,
        ws: WebSocket,
        onerror: onBlockNativeError,
      }
      blocknative.destroy()
      blocknative = new BlocknativeSdk(blockNativeOptions)
    }
  }

  let blockNativeOptions = {
    // dappId: process.env.BLOCKNATIVE_API_KEY_GLANUM,
    dappId: key,
    networkId: +process.env.BINANCE_SMART_CHAIN_ID,
    ws: WebSocket,
    onerror: onBlockNativeError,
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const strategie = await prisma.strategie.findUnique({
    where: {
      id: strategyId,
    },
  })

  if (!strategie) throw new Error('No strategie given')

  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  if (!user) throw new Error('No user given')

  let preditionContract
  let signer
  let emitter
  let players = []

  logger.info(
    `[LAUNCHING] Job launching job MULTIPLE PLAYER for strategie ${strategie.id} and address ${strategie.generated}`
  )

  let blocknative = new BlocknativeSdk(blockNativeOptions)

  const loadPlayers = async () => {
    const favorites = await prisma.favorite.findMany({
      where: {
        type: 'LIKE',
        userId,
      },
    })

    return await Promise.all(favorites.map((favorite) => loadPlayer(favorite.player)))
  }

  const calculateBetAmount = () => {
    let newBetAmount = 0.0
    if (strategie.isTrailing) {
      newBetAmount = parseFloat((strategie.startedAmount * strategie.betAmountPercent) / 100).toFixed(4)
    } else {
      newBetAmount = parseFloat((strategie.currentAmount * strategie.betAmountPercent) / 100).toFixed(4)
    }

    logger.info(
      `[CALCULATE_BET_AMOUT] isTrailing ${strategie.isTrailing} bet amount is ${newBetAmount} : currentBankroll ${strategie.currentAmount} & betAmount ${strategie.betAmountPercent}%`
    )

    if (newBetAmount < config.MIN_BET_AMOUNT) newBetAmount = config.MIN_BET_AMOUNT

    if (newBetAmount > config.MAX_BET_AMOUNT) newBetAmount = config.MAX_BET_AMOUNT

    strategie.betAmount = newBetAmount

    // OLD OPTIMIZATION --> TODO : Try to integrate in new approche

    /* OPTIMIZE STRATEGIE BET AMOUNT */
    // if (strategie.currentAmount > strategie.stepBankroll * 1.2) {
    //   const newBetAmount = parseFloat(strategie.betAmount * 1.1).toFixed(4)
    //   logger.info(`[OPTIMIZE] Increasing bet amount from ${strategie.betAmount} to ${newBetAmount}`)
    //   strategie.betAmount = newBetAmount
    //   strategie.stepBankroll = strategie.currentAmount
    // }

    // if (strategie.currentAmount < strategie.stepBankroll / 1.2) {
    //   const newBetAmount = parseFloat(strategie.betAmount / 1.1).toFixed(4)
    //   logger.info(`[OPTIMIZE] Decreasing bet amount from ${strategie.betAmount} to ${newBetAmount}`)
    //   strategie.betAmount = newBetAmount
    //   strategie.stepBankroll = strategie.currentAmount
    // }
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

    const tx = await preditionContract.claim(claimablesEpochs, {
      gasLimit: ethers.utils.hexlify(config.HEXLIFY_SAFE),
      gasPrice: ethers.utils.parseUnits(config.SAFE_GAS_PRICE.toString(), 'gwei').toString(),
      nonce: provider.getTransactionCount(strategie.generated, 'latest'),
    })

    try {
      await tx.wait()
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
      const tx = await preditionContract[betBullOrBear](epoch.toString(), {
        value: ethers.utils.parseEther(amount),
        nonce: strategie.nonce,
        gasPrice: strategie.gasPrice,
        gasLimit: strategie.gasLimit,
      })

      await tx.wait()
      logger.info(`[PLAYING] Transaction OK`)

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

      if (secondsLeft >= 15 && isAlreadyRetried === false)
        return await betRound({ epoch, betBull, betAmount, isAlreadyRetried: true })
      else {
        isError = true
        strategie.playsCount += 1
      }
      // isError = true
      // strategie.errorCount += 1
    }
  }

  const playRound = async ({ epoch }) => {
    logger.info(`********** [ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] PLAYING **********`)

    // TODO 0.0.4 : Calculate KELLY CRITERION bet value
    // https://dqydj.com/kelly-criterion-bet-calculator/
    const { bullAmount, bearAmount, startTimestamp } = await preditionContract.rounds(epoch)

    const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp
    const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

    const timer = secondsLeftUntilNextEpoch - 7

    logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] Waiting ${timer} seconds to play epoch ${epoch}`)

    let betBullCount = strategie.plays.filter((p) => p.betBull)
    let betBearCount = strategie.plays.filter((p) => !p.betBull)

    const totalPlayers = betBullCount.length + betBearCount.length

    let isBullBetter =
      betBullCount.map((p) => +p.player.winRate).reduce((acc, winRate) => acc + winRate, 0) / betBullCount.length || 0

    const totalBetsForRound = [...betBullCount, ...betBearCount]
      .map((p) => +p.player.totalBets)
      .reduce((acc, num) => acc + num, 0)

    let isBullBetterAdjusted =
      betBullCount
        .map((p) => {
          return parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound) * +p.player.winRate)
          // return parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound))
        })
        .reduce((acc, winRate) => acc + winRate, 0) / betBullCount.length || 0
    isBullBetterAdjusted = parseFloat(isBullBetterAdjusted).toFixed(2)

    let isBearBetter =
      betBearCount.map((p) => +p.player.winRate).reduce((acc, winRate) => acc + winRate, 0) / betBearCount.length || 0

    let isBearBetterAdjusted =
      betBearCount
        .map((p) => {
          return parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound) * +p.player.winRate)
          // return parseInt(+p.player.winRate * ((+p.player.totalBets * 100) / totalBetsForRound))
        })
        .reduce((acc, winRate) => acc + winRate, 0) / betBearCount.length || 0
    isBearBetterAdjusted = parseFloat(isBearBetterAdjusted).toFixed(2)

    const isDifferenceAdjustedEfficient =
      +isBullBetterAdjusted > +isBearBetterAdjusted
        ? +isBullBetterAdjusted - +isBearBetterAdjusted
        : +isBearBetterAdjusted - +isBullBetterAdjusted

    const ratingUp = (
      1 +
      parseFloat(ethers.utils.formatEther(bearAmount)) / parseFloat(ethers.utils.formatEther(bullAmount))
    ).toFixed(2)
    const ratingDown = (
      1 +
      parseFloat(ethers.utils.formatEther(bullAmount)) / parseFloat(ethers.utils.formatEther(bearAmount))
    ).toFixed(2)

    const currentWinRate = 0.55
    const averageWinRateBull = isBullBetter ? isBullBetter / 100 : currentWinRate
    const averageWinRateBear = isBearBetter ? isBearBetter / 100 : currentWinRate

    // const kellyCriterionBull = (ratingUp * currentWinRate - (1 - currentWinRate)) / ratingUp
    // const kellyCriterionBear = (ratingDown * currentWinRate - (1 - currentWinRate)) / ratingDown

    const kellyCriterionBull = (ratingUp * averageWinRateBull - (1 - averageWinRateBull)) / ratingUp
    const kellyCriterionBear = (ratingDown * averageWinRateBear - (1 - averageWinRateBear)) / ratingDown

    const kellyBetAmountBull = parseFloat(strategie.startedAmount * (kellyCriterionBull / 3)).toFixed(3)
    const kellyBetAmountBear = parseFloat(strategie.startedAmount * (kellyCriterionBear / 3)).toFixed(3)

    console.log(
      '🚀 ~ AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ~ kellyCriterionBull (%)',
      kellyCriterionBull,
      'ratingUp',
      ratingUp,
      'averageWinRateBull',
      averageWinRateBull,
      'kellyBetAmountBull',
      kellyBetAmountBull,
      'strategie.betAmount',
      strategie.betAmount
    )
    console.log(
      '🚀 ~ BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB ~ kellyCriterionBear (%)',
      kellyCriterionBear,
      'ratingDown',
      ratingDown,
      'averageWinRateBear',
      averageWinRateBear,
      'kellyBetAmountBear',
      kellyBetAmountBear,
      'strategie.betAmount',
      strategie.betAmount
    )
    // console.log('🚀 ~ CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC ~ player.winRate', strategie)
    logger.info('//////////////////////////      ////////////////////////////////')

    if (strategie.plays.length === 0)
      return logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] NO USERS PLAYED`)

    if (
      (totalPlayers > 1 || Math.round(+isBullBetter) >= 57) &&
      betBullCount.length >= betBearCount.length &&
      +isBullBetterAdjusted > +isBearBetterAdjusted
    ) {
      logger.info('///////////////////////// BULL /////////////////////////////////')
      await betRound({ epoch, betBull: true, betAmount: kellyBetAmountBull })
      logger.info('//////////////////////////////////////////////////////////')
    } else if (
      (totalPlayers > 1 || Math.round(+isBearBetter) >= 57) &&
      betBearCount.length >= betBullCount.length &&
      +isBearBetterAdjusted > +isBullBetterAdjusted
    ) {
      logger.info('////////////////////////// BEAR ////////////////////////////////')
      await betRound({ epoch, betBull: false, betAmount: kellyBetAmountBear })
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
    )
    logger.info('//////////////////////////      ////////////////////////////////')

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

    players = await loadPlayers()
    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] Reloaded ${players?.length} players for user ${
        strategie.generated
      }`
    )

    strategie.plays = []
    strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')

    await Promise.all(players.map(waitForTransaction))

    const { startTimestamp } = await preditionContract.rounds(epoch)

    const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

    const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

    const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
    const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

    logger.info(
      `[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] time left ${minutesLeft} minuts ${secondsLeft} seconds`
    )

    const timer = secondsLeftUntilNextEpoch - 9.5

    logger.info(`[ROUND-${user.id}:${strategie.roundsCount}:${+epoch}] Waiting ${timer} seconds to play epoch ${epoch}`)

    await sleep(timer * 1000)
    // await setTimeout(timer * 1000)

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
      await claimPlayedEpochs(lastEpochs)

      await sleep(10 * 1000)
      strategie.playedEpochs = []
      strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')
    }

    // TODO REACTIVATE AFTER TEST
    calculateBetAmount()

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
  }

  const waitForTransaction = async (player) => {
    // logger.info(`[LISTEN] Waiting for transaction from player ${player.id}`)

    const { emitter: emt } = blocknative.account(player.id)
    emitter = emt
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

    const timer = secondsLeftUntilNextEpoch - 9.5

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
    // await setTimeout(timer * 1000)

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
    strategie.plays = []
    strategie.playedHashs = []
    strategie.playedEpochs = []
    strategie.errorCount = 0

    strategie.gasPrice = ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()

    strategie.gasLimit = ethers.utils.hexlify(config.HEXLIFY_SAFE)
    strategie.nonce = provider.getTransactionCount(strategie.generated, 'latest')

    // TODO REACTIVATE AFTER TEST
    calculateBetAmount()
    // strategie.betAmount = +(strategie.currentAmount / 15).toFixed(4)
    // strategie.betAmount = config.MIN_BET_AMOUNT
    // strategie.betAmount = config.BET_AMOUNT
    // strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)

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

    players = await loadPlayers()

    logger.info(`[LISTEN] Starting for user ${strategie.generated} copy ${players?.length} players`)

    await Promise.all(players.map(waitForTransaction))

    preditionContract.on('StartRound', roundStartListenner)
    preditionContract.on('EndRound', roundEndListenner)

    await tryToEnterFast()
  }

  await listen()
}

module.exports = { run }
