const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const { PromisePool } = require('@supercharge/promise-pool')

const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')

const { sleep, range } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

const run = async (payload) => {
  // multiples providers
  const JSON_RPC_PROVIDERS = [
    // 'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://bsc-dataseed1.ninicoin.io/',
  ]
  const providers = JSON_RPC_PROVIDERS.map((provider) => new ethers.providers.JsonRpcProvider(provider))
  const provider = new ethers.providers.FallbackProvider(
    providers.map((provider, index) => {
      return { provider: provider, stallTimeout: 500 + 500 * index, priority: index + 1 }
    })
  )

  // single provider
  // const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const { user, strategie } = payload
  let preditionContract
  let signer
  let emitter

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  if (!user) throw new Error('No user given')
  if (!strategie) throw new Error('No strategie given')
  if (strategie.running) throw new Error('Strategie is already running')

  logger.info(
    `[LAUNCHING] Job launching job SINGLE PLAYER for strategie ${strategie.id} and address ${strategie.generated}`
  )

  const blockNativeOptions = {
    dappId: process.env.BLOCKNATIVE_API_KEY,
    networkId: +process.env.BINANCE_SMART_CHAIN_ID,
    ws: WebSocket,
    onerror: (error) => {
      logger.error(error)
      // TODO v0.0.3 restart strategie
      logger.error('[PLAYING] Blocknative listenner error', error.toString())
      process.exit(0)
      // await stopStrategie({ epoch: -1 })
    },
  }
  const blocknative = new BlocknativeSdk(blockNativeOptions)

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
      // logger.error(error.message)

      return {
        epoch,
        isPlayed: false,
        isClaimable: false,
        isWon: false,
      }
    }
  }

  const claimPlayedEpochs = async (epochs) => {
    // logger.info(`[CLAIM] try to claim ${epochs.length} last epochs : ${epochs}`)
    logger.info(`[CLAIM] try to claim ${epochs.length} last epochs`)

    // const claimables = await Promise.all(epochs.map(checkIfClaimable))

    const { results: claimables, errors } = await PromisePool.for(epochs).withConcurrency(12).process(checkIfClaimable)

    if (errors.length) {
      logger.error(`[CLAIM] claimPlayedEpochs error for user ${user.id} when claiming ${epochs.length} last epochs`)
      logger.error(errors)
    }

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

    // const claimablesEpochs = claimables.filter((c) => c.isClaimable).map((c) => c.epoch)
    const claimablesEpochs = [...new Set(claimables.filter((c) => c.isClaimable).map((c) => +c.epoch))]

    if (claimablesEpochs.length === 0) return logger.info('[CLAIM] Nothing to claim')

    logger.info(`[CLAIM] claimables epochs : ${claimablesEpochs}`)

    // const gasPrice = await provider.getGasPrice()

    const gasLimit = 350000 + 350000 * Math.round(claimablesEpochs.length / 5)

    const tx = await preditionContract.claim(claimablesEpochs, {
      // gasLimit: ethers.utils.hexlify(350000),
      gasLimit: ethers.utils.hexlify(gasLimit),
      // gasPrice,
      gasPrice: ethers.utils.parseUnits(config.SAFE_GAS_PRICE.toString(), 'gwei').toString(),
      nonce: provider.getTransactionCount(strategie.generated, 'latest'),
      // nonce: new Date().getTime(),
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

    if (!(strategie.betAmount != 0)) {
      logger.error('[PLAYING] Bet amount is 0')
      await stopStrategie({ epoch })
    }

    const betBullOrBear = betBull ? 'betBull' : 'betBear'

    let isError = false
    try {
      // const gasPrice = await provider.getGasPrice()

      const tx = await preditionContract[betBullOrBear](epoch.toString(), {
        value: ethers.utils.parseEther(betAmount),
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
      throw new Error(error)
    }
    // TODO save bet to database
    // const bet = { epoch, betBull, betAmount, isError, strategieId: strategie.id, userId : user.id, hash : strategie.playedHashs[strategie.playedHashs.lenght-1], isClaimed : false}
  }

  const processRound = async (transaction) => {
    const epoch = await preditionContract.currentEpoch()

    // logger.info(`[LISTEN] Transaction pending detected for playerAddress ${strategie.player} and epoch ${epoch}`)

    if (transaction.from.toLowerCase() !== strategie.player) {
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

    // TODO ANALYSE BET % FREQUENCY IN HISTORIE TO SEE IF IT'S A RISKED BET
    // --> (Some players bet really smaller amount when they are trying to play a market flip)
    // let playerBalance = await provider.getBalance(playerAddress, "latest")
    // playerBalance = ethers.utils.formatEther(playerBalance)

    // let balance = await provider.getBalance(signer.address)
    // balance = ethers.utils.formatEther(balance)

    // TODO DECODE FUNCTION (see pending.js)
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

    try {
      await betRound({ epoch, betBull, betAmount })

      logger.info('------------------------------------------------------------')
      logger.info('------------------------------------------------------------')
      logger.info(`[PLAYING] Betting on ${betBull ? 'BULL' : 'BEAR'} with ${betAmount} BNB amount for epoch ${epoch}`)

      // await betRound({ epoch, betBull, betAmount })

      logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)
      strategie.playedHashs.push(transaction.hash)

      logger.info('------------------------------------------------------------')
      logger.info('------------------------------------------------------------')
    } catch (error) {
      //
    }
  }

  const claimLastEpochs = async (epoch, to) => {
    const lastEpochs = [...range(+epoch - to, +epoch)]

    if (!lastEpochs.length) return logger.error(`[ERROR] Error during claiming for last epochs : no epochs findeds`)

    // await claimPlayedEpochs(lastEpochs)
    // await claimPlayedEpochs([...new Set([...lastEpochs, ...strategie.playedEpochs])])
    await claimPlayedEpochs(lastEpochs)

    //wait for all transactions to completes
    // avoid error for stop loss if claim a lot of amount
    await sleep(10 * 1000)
    strategie.playedEpochs = []
  }

  const roundEndListenner = async (epoch) => {
    strategie.roundsCount += 1

    const currentAmountBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

    logger.info(
      `[ROUND:${+epoch}:${strategie.player}:${strategie.roundsCount}] Round finished for epoch ${+epoch} : played ${
        strategie.playsCount
      }/${strategie.roundsCount} games. Current bankroll amount ${strategie.currentAmount}`
    )

    // TODO v0.03 : if isTrailing, claim for each epoch.
    if ((strategie.roundsCount % 5 === 0 || !strategie.isTrailing) && strategie.playedEpochs.length > 1)
      await claimLastEpochs(epoch, 6)

    // if (strategie.playedEpochs.length >= 3) {
    // await claimPlayedEpochs(strategie.playedEpochs)
    // strategie.playedEpochs = []
    // }

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
    if (strategie.currentAmount <= isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount) {
      await claimLastEpochs(epoch, 12 * 24)
      const currentAmountBigInt = await provider.getBalance(signer.address)
      strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

      if (strategie.currentAmount <= isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount) {
        logger.info(
          `[PLAYING] Stop Loss activated for player ${user.id} : current amount ${
            strategie.currentAmount
          } --> STOP LOSS : ${isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount}`
        )
        await stopStrategie({ epoch })
      }
    }

    if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
      await claimLastEpochs(epoch, 6)
      if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
        logger.info(
          `[PLAYING] Take Profit activated for player ${user.id} : current amount ${strategie.currentAmount} --> TAKE PROFIT : ${isUpdatedStrategie.minWinAmount}`
        )
        await stopStrategie({ epoch })
      }
    }

    if (strategie.errorCount >= 5) {
      await claimLastEpochs(epoch, 6)
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

    if (!isUpdatedStrategie.isActive || isUpdatedStrategie.isError || isUpdatedStrategie.isDeleted) {
      logger.error('[PLAYING] Strategie was updated by user (stopped or deleted) and need to be stoped.')
      await stopStrategie({ epoch })
    }
  }

  const listen = async () => {
    const privateKey = decrypt(strategie.private)
    signer = new ethers.Wallet(privateKey, provider)

    // const initialBankrollBigInt = await provider.getBalance(signer.address)
    // strategie.initialBankroll = ethers.utils.formatEther(initialBankrollBigInt)
    // strategie.bankroll = strategie.initialBankroll
    // strategie.startedBalance = strategie.initialBankroll
    strategie.playedHashs = []
    strategie.playedEpochs = []
    strategie.errorCount = 0

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
          isNeedRestart: false,
        },
      })
      const isPaused = await preditionContract.paused()

      if (isPaused) {
        logger.error(`[ERROR] Contract is paused. Waiting one hour `)
        // await stopStrategie()

        // TODO is Waiting better than pause Strategie ?

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

      // await claimLastEpochs(epoch, 12 * 24)
      await claimLastEpochs(epoch, 12)
    } catch (error) {
      logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    }

    const epoch = await preditionContract.currentEpoch()

    // return
    const initialBankrollBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(initialBankrollBigInt)
    // strategie.stepBankroll = strategie.startedAmount
    // strategie.betAmount = +(strategie.currentAmount / 15).toFixed(4)
    // strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)

    strategie.gasPrice = ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()
    // strategie.gasPrice = await provider.getGasPrice()
    // console.log(
    //   '🚀 ~ file: index.js ~ line 420 ~ listen ~ await provider.getGasPrice()',
    //   await (await provider.getGasPrice()).toString()
    // )
    // console.log(
    //   "🚀 ~ file: index.js ~ line 419 ~ listen ~ ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()",
    //   ethers.utils.parseUnits(config.FAST_GAS_PRICE.toString(), 'gwei').toString()
    // )

    // Raw Transaction
    // const rawTx = {
    //   nonce: provider.getTransactionCount(strategie.generated, 'latest'),
    //   value: ethers.utils.parseEther(strategie.betAmount.toString()),
    // }

    // Gas limit
    // let gasLimit = await provider.estimateGas(
    //   strategie.generated,
    //   process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    //   ethers.utils.parseEther(strategie.betAmount.toString()),
    //   rawTx
    // )

    // const estimate = await provider.estimateGas({
    //   from: strategie.generated,
    //   to: process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    //   value: ethers.utils.parseEther(strategie.betAmount.toString()),
    // })
    // console.log('🚀 ~ file: index.js ~ line 461 ~ listen ~ estimate', estimate).toString()

    // const gasLimit = await provider.estimateGas({
    //   to: process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    //   value: ethers.utils.parseEther(strategie.betAmount.toString()),
    // })

    // strategie.gasLimit = ethers.utils.hexlify(gasLimit)

    // strategie.gasLimit = ethers.utils.hexlify(250000)
    strategie.gasLimit = ethers.utils.hexlify(350000)

    calculateBetAmount()

    // should never append
    if (strategie.betAmount < config.MIN_BET_AMOUNT || strategie.betAmount > config.MAX_BET_AMOUNT) {
      logger.error(`[LISTEN] Bet amount error, value is ${strategie.betAmount} Stopping strategie for now`)
      await stopStrategie({ epoch })
      return
    }

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

    logger.info(`[LISTEN] Starting for user ${strategie.generated} copy betting player ${strategie.player}`)

    logger.info(`[LISTEN] Waiting for transaction for player ${strategie.player}`)
    // logger.info(`[LISTEN] emitter is listenning to transaction from mempool`)
    preditionContract.on('EndRound', roundEndListenner)

    const { emitter: emt } = blocknative.account(strategie.player)
    emitter = emt
    emitter.on('txPool', processRound)
  }

  try {
    await listen()
  } catch (error) {
    console.log('🚀 ~ file: index.js ~ line 582 ~ //betRound ~ error', error)
    logger.error(
      `[ERROR] Stopping strategie for user ${strategie.generated} copy betting player ${strategie.player}: ${error}`
    )
    await stopStrategie({ epoch: -1 })
    throw new Error(error)
  }
}

module.exports = { run }
