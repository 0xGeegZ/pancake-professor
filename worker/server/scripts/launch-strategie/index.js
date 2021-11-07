const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')

const { PREDICTION_CONTRACT_ABI } = require('../../../../src/contracts/abis/pancake-prediction-abi-v3')

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

const options = {
  dappId: process.env.BLOCKNATIVE_API_KEY,
  networkId: 56,
  ws: WebSocket,
  onerror: (error) => {
    logger.error(error)
  },
}

const launchStrategie = async (payload) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

  const { user, strategie } = payload
  let preditionContract
  let signer

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  if (!user) throw new Error('No user given')
  if (!strategie) throw new Error('No strategie given')
  if (strategie.running) throw new Error('Strategie is running')

  // TODO update user to isplaying True.
  logger.info(`[LAUNCHING] Job launching job for strategie ${strategie.id} and user ${user.id}`)
  const blocknative = new BlocknativeSdk(options)

  // const betRound = async ({ epoch, betBull, betAmount, isAlreadyRetried = false }) => {
  const betRound = async ({ epoch, betBull, betAmount }) => {
    if (strategie.currentAmount === 0) {
      logger.error('[PLAYING] Not enought BNB')
      await prisma.strategie.update({
        where: { id: strategie.id },
        data: {
          isError: true,
          isActive: false,
        },
      })
      return
    }
    // if (bankroll > countedBankroll * 1.5) {
    //   const newBetAmount = parseFloat(betAmount * 1.25).toFixed(4)
    //   logger.info(`[OPTIMIZE] Increasing bet amount from ${betAmount} to ${newBetAmount}`)
    //   betAmount = newBetAmount
    //   BET_AMOUNT = newBetAmount
    //   countedBankroll = bankroll
    // }

    // if (bankroll < countedBankroll / 1.5) {
    //   const newBetAmount = parseFloat(betAmount / 1.25).toFixed(4)
    //   logger.info(`[OPTIMIZE] Decreasing bet amount from ${betAmount} to ${newBetAmount}`)
    //   betAmount = newBetAmount
    //   BET_AMOUNT = newBetAmount
    //   countedBankroll = bankroll
    // }

    if (betAmount < MIN_BET_AMOUNT) betAmount = MIN_BET_AMOUNT

    if (betAmount > MAX_BET_AMOUNT) betAmount = MAX_BET_AMOUNT

    const amount = parseFloat(betAmount).toFixed(4)
    const betBullOrBear = betBull ? 'betBull' : 'betBear'

    const gasPrice = await provider.getGasPrice()

    // eslint-disable-next-line eqeqeq
    if (!(+amount != 0)) {
      logger.error('[PLAYING] Bet amount is 0')
      await prisma.strategie.update({
        where: { id: strategie.id },
        data: {
          isError: true,
          isActive: false,
        },
      })
      return
    }

    let isError = false
    try {
      const tx = await preditionContract[betBullOrBear](epoch.toString(), {
        value: ethers.utils.parseEther(amount),
        gasPrice,
        nonce: provider.getTransactionCount(user.generated, 'latest'),
        // gasPrice: ethers.utils.parseUnits(FAST_GAS_PRICE.toString(), 'gwei').toString(),
        // gasLimit: ethers.utils.hexlify(250000),
      })

      await tx.wait()

      strategie.playedEpochs.push(epoch.toString())
      strategie.playsCount += 1
    } catch (error) {
      logger.error(`[PLAYING] Betting Tx Error for user ${user.id} and epoch ${epoch}`)
      logger.error(error.message)
      isError = true
      // Try to reenter
      // const { startTimestamp, lockTimestamp } = await preditionContract.rounds(currentEpoch)

      // const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

      // const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

      // const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
      // const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

      // console.log('🚀  ~ secondsLeft', secondsLeft)

      // if (secondsLeft >= 15 && isAlreadyRetried === false) await bet(epoch, betBull, betAmount, true)
      // else {
      //   playsCount++
      //   playsCountForActualPlayer++
      // }
    }
    logger.info('------------------------------------------------------------')
    logger.info('------------------------------------------------------------')
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
    logger.info(`[PLAYING] Betting on ${betBull ? 'BULL' : 'BEAR'} with ${betAmount}BNB amount for epoch ${epoch}`)

    strategie.playedHashs.push(transaction.hash)

    await betRound({ epoch, betBull, betAmount })
  }

  const roundEndListenner = async (epoch) => {
    strategie.roundsCount += 1

    // const currentAmountBigInt = await provider.getBalance(signer.address)
    // strategie.currentAmount = parseInt(ethers.utils.formatEther(currentAmountBigInt), 10)

    // TODO update currentAmount with user bet history

    logger.info(
      `[ROUND:${+epoch}:${strategie.player}:${strategie.roundsCount}] Round finished for epoch ${+epoch} : played ${
        strategie.playsCount
      }/${strategie.roundsCount} games. Current bankroll amount ${strategie.currentAmount}`
    )

    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        // currentAmount: strategie.currentAmount,
        playsCount: strategie.playsCount,
        roundsCount: strategie.roundsCount,
      },
    })

    // if (playedEpochs.length >= 3) {
    //   await claimPlayedEpochs(lastEpochs)
    //   playedEpochs = []
    // }
  }

  const listen = async () => {
    const privateKey = decrypt(user.private)
    signer = new ethers.Wallet(privateKey, provider)

    // const initialBankrollBigInt = await provider.getBalance(signer.address)
    // strategie.initialBankroll = parseInt(ethers.utils.formatEther(initialBankrollBigInt), 10)
    // strategie.bankroll = strategie.initialBankroll
    // strategie.startedBalance = strategie.initialBankroll

    strategie.bankroll = strategie.currentAmount
    strategie.startedBalance = strategie.currentAmount
    strategie.betAmount = +(strategie.bankroll / 10).toFixed(4)
    strategie.playedHashs = []
    strategie.playedEpochs = []

    if (strategie.betAmount <= MIN_BET_AMOUNT || strategie.betAmount > MAX_BET_AMOUNT) {
      logger.info(`[LISTEN] Bet amount error. Stopping strategie for now`)
      await prisma.strategie.update({
        where: { id: strategie.id },
        data: {
          isError: true,
          isActive: false,
        },
      })
      return
    }

    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        isRunning: true,
      },
    })

    logger.info(`[LISTEN] Stetting up bet amount to ${strategie.betAmount} for initial bankroll ${strategie.bankroll}.`)

    preditionContract = new ethers.Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      PREDICTION_CONTRACT_ABI,
      signer
    )
    logger.info(`[LISTEN] Starting for user ${user.generated} copy betting player ${strategie.player}`)

    logger.info(`[LISTEN] Waiting for transaction for player ${strategie.player}`)
    const { emitter } = blocknative.account(strategie.player)
    emitter.on('txPool', processRound)

    // logger.info(`[LISTEN] emitter is listenning to transaction from mempool`)
    preditionContract.on('EndRound', roundEndListenner)
  }

  try {
    await listen()
  } catch (error) {
    console.log('🚀 ~ file: index.ts ~ line 199 ~ listen ~ error', error)
    throw new Error(error)
    // TODO update user to isplaying false.
  }
}

module.exports = { launchStrategie }
