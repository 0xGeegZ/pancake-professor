const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const { sleep } = require('../../utils/utils')

const { PREDICTION_CONTRACT_ABI } = require('../../../../src/contracts/abis/pancake-prediction-abi-v3')
// const { PREDICTION_CONTRACT_ABI } = require('../../../../src/contracts/abis/pancake-prediction-abi-v3')

const { decrypt } = require('../../utils/crpyto')
const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')
// import { PREDICTION_CONTRACT_ABI } from 'src/contracts/abis/pancake-prediction-abi-v3'
// import { decrypt } from 'src/server/utils/crpyto'
// import logger from 'src/server/utils/logger'
const BET_BULL_METHOD_ID = '0x57fb096f'
const BET_BEAR_METHOD_ID = '0xaa6b873a'
const CLAIM_BEAR_METHOD_ID = '0x6ba4c138'

const MAX_BET_AMOUNT = 0.1
const MIN_BET_AMOUNT = 0.001

const SAFE_GAS_PRICE = 5
// const FAST_GAS_PRICE = 6
const FAST_GAS_PRICE = 7

const options = {
  dappId: process.env.BLOCKNATIVE_API_KEY,
  networkId: 56,
  ws: WebSocket,
  onerror: (error) => {
    logger.error(error)
  },
}

let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start)

const launchStrategie = async (payload) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const { user, strategie } = payload
  let preditionContract
  let signer
  let emitter

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  if (!user) throw new Error('No user given')
  if (!strategie) throw new Error('No strategie given')
  if (strategie.running) throw new Error('Strategie is running')

  logger.info(`[LAUNCHING] Job launching job for strategie ${strategie.id} and address ${strategie.generated}`)
  const blocknative = new BlocknativeSdk(options)

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
      const lastEpochs = [...range(+epoch - 288, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    }
    //TODO reactivate for production
    // process.exit(0)
  }
  // const betRound = async ({ epoch, betBull, betAmount, isAlreadyRetried = false }) => {
  const betRound = async ({ epoch, betBull, betAmount, isAlreadyRetried = false }) => {
    if (strategie.currentAmount === 0) {
      logger.error('[PLAYING] Not enought BNB')
      await stopStrategie({ epoch })
    }

    // if (bankroll > countedBankroll * 1.5) {
    //   const newBetAmount = parseFloat(betAmount * 1.25).toFixed(4)
    //   logger.info(`[OPTIMIZE] Increasing bet amount from ${betAmount} to ${newBetAmount}`)
    //   betAmount = newBetAmount
    //   strategie.betAmount = newBetAmount
    //   countedBankroll = bankroll
    // }

    // if (bankroll < countedBankroll / 1.5) {
    //   const newBetAmount = parseFloat(betAmount / 1.25).toFixed(4)
    //   logger.info(`[OPTIMIZE] Decreasing bet amount from ${betAmount} to ${newBetAmount}`)
    //   betAmount = newBetAmount
    //   strategie.betAmount = newBetAmount
    //   countedBankroll = bankroll
    // }

    if (betAmount < MIN_BET_AMOUNT) betAmount = MIN_BET_AMOUNT

    if (betAmount > MAX_BET_AMOUNT) betAmount = MAX_BET_AMOUNT

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
        nonce: provider.getTransactionCount(strategie.generated, 'latest'),
        gasPrice: strategie.gasPrice,
        gasLimit: strategie.gasLimit,
        // gasPrice: ethers.utils.parseUnits(FAST_GAS_PRICE.toString(), 'gwei').toString(),
        // gasLimit: ethers.utils.hexlify(250000),
        // gasPrice,
      })

      await tx.wait()

      strategie.playedEpochs.push(epoch.toString())
      strategie.playsCount += 1
    } catch (error) {
      logger.error(`[PLAYING] Betting Tx Error for adress ${strategie.generated} and epoch ${epoch}`)
      logger.error(error.message)
      isError = true
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
    }
    // TODO save bet to database
    // const bet = { epoch, betBull, betAmount, isError, strategieId: strategie.id, userId : user.id, hash : strategie.playedHashs[strategie.playedHashs.lenght-1], isClaimed : false}
  }

  const processRound = async (transaction) => {
    const epoch = await preditionContract.currentEpoch()

    logger.info(`[LISTEN] Transaction pending detected for playerAddress ${strategie.player} and epoch ${epoch}`)

    if (transaction.from.toLowerCase() !== strategie.player) {
      logger.error(`[LISTEN] Incoming transaction.`)
      return
    }

    if (transaction.to.toLowerCase() !== process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS) {
      logger.info(`[LISTEN] Not a transaction with pancake contract.`)
      return
    }

    if (!transaction.input.includes(BET_BULL_METHOD_ID) && !transaction.input.includes(BET_BEAR_METHOD_ID)) {
      logger.info(`[LISTEN] Not a bull or bear transaction.`)
      return
    }

    if (transaction.input.includes(CLAIM_BEAR_METHOD_ID)) {
      logger.info(`[LISTEN] Claim transaction.`)
      return
    }

    if (strategie.playedHashs.includes(transaction.hash)) {
      logger.info(`[LISTEN] Already played transaction hash.`)
      return
    }

    logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)

    // TODO ANALYSE BET % FREQUENCY IN HISTORIE TO SEE IF IT'S A RISKED BET
    // --> (Some players bet really smaller amount when they are trying to play a market flip)
    // let playerBalance = await provider.getBalance(playerAddress, "latest")
    // playerBalance = ethers.utils.formatEther(playerBalance)

    // let balance = await provider.getBalance(signer.address)
    // balance = ethers.utils.formatEther(balance)

    // TODO DECODE FUNCTION (see pending.js)
    const betBull = transaction.input.includes(BET_BULL_METHOD_ID)

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

  const roundEndListenner = async (epoch) => {
    strategie.roundsCount += 1

    if (strategie.roundsCount % 5 === 0) {
      const lastEpochs = [...range(+epoch - 6, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    }
    // if (strategie.playedEpochs.length >= 3) {
    // await claimPlayedEpochs(strategie.playedEpochs)
    // strategie.playedEpochs = []
    // }

    const currentAmountBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

    logger.info(
      `[ROUND:${+epoch}:${strategie.player}:${strategie.roundsCount}] Round finished for epoch ${+epoch} : played ${
        strategie.playsCount
      }/${strategie.roundsCount} games. Current bankroll amount ${strategie.currentAmount}`
    )

    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        currentAmount: strategie.currentAmount,
        playsCount: strategie.playsCount,
        roundsCount: strategie.roundsCount,
      },
    })

    const isUpdatedStrategie = await prisma.strategie.findUnique({
      where: {
        id: strategie.id,
      },
    })

    // Check if stop loss or take profit
    if (strategie.currentAmount <= isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount) {
      logger.info(
        `[PLAYING] Stop Loss activated for player ${user.id} : current amount ${
          strategie.currentAmount
        } --> STOP LOSS : ${isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount}`
      )
      await stopStrategie({ epoch })
    }

    if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
      logger.info('[PLAYING] Take Profit activated.')
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
      gasLimit: ethers.utils.hexlify(250000),
      gasPrice,
      // gasPrice: parseUnits(SAFE_GAS_PRICE.toString(), 'gwei').toString(),
      nonce: provider.getTransactionCount(strategie.generated, 'latest'),
    })

    try {
      await tx.wait()
      //Wait for last transaction to be proceed.
      await sleep(10 * 1000)
    } catch (error) {
      logger.error(`[CLAIM] Claim Tx Error for user ${user.id} and epochs ${claimablesEpochs}`)
      logger.error(error.message)
    }
  }

  const listen = async () => {
    const privateKey = decrypt(strategie.private)
    signer = new ethers.Wallet(privateKey, provider)

    // const initialBankrollBigInt = await provider.getBalance(signer.address)
    // strategie.initialBankroll = ethers.utils.formatEther(initialBankrollBigInt)
    // strategie.bankroll = strategie.initialBankroll
    // strategie.startedBalance = strategie.initialBankroll

    preditionContract = new ethers.Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
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

      // TODO try to claim all played epoch ??
      const lastEpochs = [...range(+epoch - 24, +epoch)]
      await claimPlayedEpochs(lastEpochs)
    } catch (error) {
      logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    }

    const initialBankrollBigInt = await provider.getBalance(signer.address)
    strategie.currentAmount = +ethers.utils.formatEther(initialBankrollBigInt)
    strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)
    strategie.playedHashs = []
    strategie.playedEpochs = []

    strategie.gasPrice = ethers.utils.parseUnits(FAST_GAS_PRICE.toString(), 'gwei').toString()
    // strategie.gasPrice = await provider.getGasPrice()
    // console.log(
    //   '🚀 ~ file: index.js ~ line 420 ~ listen ~ await provider.getGasPrice()',
    //   await (await provider.getGasPrice()).toString()
    // )
    // console.log(
    //   "🚀 ~ file: index.js ~ line 419 ~ listen ~ ethers.utils.parseUnits(FAST_GAS_PRICE.toString(), 'gwei').toString()",
    //   ethers.utils.parseUnits(FAST_GAS_PRICE.toString(), 'gwei').toString()
    // )

    // Raw Transaction
    // var rawTx = {
    //   nonce: provider.getTransactionCount(strategie.generated, 'latest'),
    // }

    // Gas limit
    // let gasLimit = await provider.estimateGas(
    //   strategie.generated,
    //   process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    //   ethers.utils.parseEther(strategie.betAmount.toString()),
    //   rawTx
    // )

    // const gasLimit = await provider.estimateGas({
    //   to: process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
    //   value: ethers.utils.parseEther(strategie.betAmount.toString()),
    // })

    // strategie.gasLimit = ethers.utils.hexlify(gasLimit)

    strategie.gasLimit = ethers.utils.hexlify(250000)

    if (strategie.betAmount <= MIN_BET_AMOUNT || strategie.betAmount > MAX_BET_AMOUNT) {
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
    const { emitter: emt } = blocknative.account(strategie.player)
    emitter = emt
    emitter.on('txPool', processRound)

    // logger.info(`[LISTEN] emitter is listenning to transaction from mempool`)
    preditionContract.on('EndRound', roundEndListenner)
  }

  try {
    await listen()
  } catch (error) {
    logger.error(
      `[ERROR] Stopping strategie for user ${strategie.generated} copy betting player ${strategie.player}: ${error}`
    )
    await stopStrategie()
    throw new Error(error)
  }
}

module.exports = { launchStrategie }
