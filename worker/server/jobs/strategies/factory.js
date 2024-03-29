const prisma = require('../../db/prisma')
const config = require('../../providers/pancakeswap/config')

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)
const { ethers } = require('ethers')

const calculateBetAmount = ({ strategie }) => {
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

  return newBetAmount
}

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

const checkIfClaimable = async ({ epoch, contract, address }) => {
  try {
    const [claimable, refundable, { claimed, amount }] = await Promise.all([
      contract.claimable(epoch, signer.address),
      contract.refundable(epoch, signer.address),
      contract.ledger(epoch, signer.address),
    ])

    return {
      epoch,
      isPlayed: amount.toString() !== '0',
      isClaimable: (claimable || refundable) && !claimed && amount.toString() !== '0',
      // isWon: claimable || refundable || (amount.toString() !== "0" && claimed)
      isWon: claimable || refundable || claimed,
    }
  } catch (error) {
    logger.error(`[CLAIM] checkIfClaimable error for user ${address} and epoch ${epoch}`)
    return {
      epoch,
      isPlayed: false,
      isClaimable: false,
      isWon: false,
    }
  }
}

const claimLastEpochs = async ({ epoch, last, strategie, contract }) => {
  const lastEpochs = [...range(+epoch - last, +epoch)]
  // await claimPlayedEpochs(lastEpochs)
  await claimPlayedEpochs({
    epochs: [...new Set([...lastEpochs, ...strategie.playedEpochs])],
    address: stragtegie.generated,
    contract,
  })

  //wait for all transactions to completes
  // avoid error for stop loss if claim a lot of amount
  await sleep(10 * 1000)
  strategie.playedEpochs = []

  return stragtegie
}

const claimPlayedEpochs = async ({ epochs, address, contract }) => {
  // logger.info(`[CLAIM] try to claim ${epochs.length} last epochs : ${epochs}`)
  logger.info(`[CLAIM] try to claim ${epochs.length} last epochs`)

  const claimables = await Promise.all(epochs.map((epoch) => checkIfClaimable({ epoch, contract, address })))

  const played = claimables.filter((c) => c.isPlayed)

  const wins = played.filter((c) => c.isWon)?.length

  const losss = played.filter((c) => !c.isWon)?.length

  logger.info(
    `[WIN/LOSS] Win/Loss ratio for player ${address} and ${claimables.length} last games : ${wins}W/${losss}L for ${
      played.length
    } played games (${parseFloat((wins * 100) / played.length).toFixed(2)}% Winrate) `
  )

  const claimablesEpochs = claimables.filter((c) => c.isClaimable).map((c) => c.epoch)

  if (claimablesEpochs.length === 0) return logger.info('[CLAIM] Nothing to claim')

  logger.info(`[CLAIM] claimables epochs : ${claimablesEpochs}`)

  const gasPrice = await provider.getGasPrice()

  const tx = await contract.claim(claimablesEpochs, {
    gasLimit: ethers.utils.hexlify(350000),
    // gasPrice,
    gasPrice: ethers.utils.parseUnits(config.SAFE_GAS_PRICE.toString(), 'gwei').toString(),
    nonce: provider.getTransactionCount(address, 'latest'),
    // nonce: new Date().getTime(),
  })

  try {
    await tx.wait()
    // //Wait for last transaction to be proceed.
    // await sleep(10 * 1000)
  } catch (error) {
    logger.error(`[CLAIM] Claim Tx Error for user ${strategie.user.id} and epochs ${claimablesEpochs}`)
    logger.error(error.message)
  }
}

const stopStrategie = async ({ epoch, strategie, emitter, contract }) => {
  logger.error(`[PLAYING] Stopping strategie ${strategie.id} for user ${strategie.user.id}`)

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
    const epochs = [...range(+epoch - 12, +epoch)]
    await claimPlayedEpochs({ epochs, adress: strategie.generated, contract })
  }
  //TODO reactivate for production
  process.exit(0)
}

const betRound = async ({ epoch, betBull, isAlreadyRetried = false, strategie, contract, emitter }) => {
  const { betAmount } = strategie

  if (strategie.currentAmount === 0) {
    logger.error('[PLAYING] Not enought BNB')
    await stopStrategie({ epoch, strategie, emitter, contract })
  }

  if (!(strategie.betAmount != 0)) {
    logger.error('[PLAYING] Bet amount is 0')
    await stopStrategie({ epoch, strategie, emitter, contract })
  }

  const betBullOrBear = betBull ? 'betBull' : 'betBear'

  strategie.isError = false
  try {
    // const gasPrice = await provider.getGasPrice()

    const tx = await contract[betBullOrBear](epoch.toString(), {
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
    const { startTimestamp, lockTimestamp } = await contract.rounds(epoch)

    const secondsFromEpoch = Math.floor(new Date().getTime() / 1000) - startTimestamp

    const secondsLeftUntilNextEpoch = 5 * 60 - secondsFromEpoch

    const minutesLeft = secondsLeftUntilNextEpoch < 60 ? 0 : Math.trunc(secondsLeftUntilNextEpoch / 60)
    const secondsLeft = secondsLeftUntilNextEpoch - minutesLeft * 60

    console.log('🚀  ~ secondsLeft', secondsLeft)

    if (secondsLeft >= 15 && isAlreadyRetried === false)
      strategie = await betRound({ epoch, betBull, isAlreadyRetried: true, strategie, contract })
    // else {
    //   strategie.playsCount += 1
    // }
    strategie.isError = true
    strategie.errorCount += 1
    // throw new Error(error)
  }

  return strategie
  // TODO save bet to database
  // const bet = { epoch, betBull, betAmount, isError, strategieId: strategie.id, userId : strategie.user.id, hash : strategie.playedHashs[strategie.playedHashs.lenght-1], isClaimed : false}
}

const processRound = async ({ transaction, strategie, contract, emitter }) => {
  const epoch = await contract.currentEpoch()

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

  strategie = await betRound({ epoch, betBull, strategie, contract, emitter })

  if (!strategie.isError) {
    logger.info('------------------------------------------------------------')
    logger.info('------------------------------------------------------------')
    logger.info(`[PLAYING] Betting on ${betBull ? 'BULL' : 'BEAR'} with ${betAmount} BNB amount for epoch ${epoch}`)

    // await betRound({ epoch, betBull, betAmount })

    logger.info(`[LISTEN] Transaction : https://bscscan.com/tx/${transaction.hash}`)
    strategie.playedHashs.push(transaction.hash)

    logger.info('------------------------------------------------------------')
    logger.info('------------------------------------------------------------')
  }

  return strategie
}

const roundEndListenner = async ({ epoch, strategie, emitter, contract }) => {
  strategie.roundsCount += 1

  const currentAmountBigInt = await provider.getBalance(signer.address)
  strategie.currentAmount = +ethers.utils.formatEther(currentAmountBigInt)

  logger.info(
    `[ROUND:${+epoch}:${strategie.player}:${strategie.roundsCount}] Round finished for epoch ${+epoch} : played ${
      strategie.playsCount
    }/${strategie.roundsCount} games. Current bankroll amount ${strategie.currentAmount}`
  )

  if (strategie.roundsCount % 5 === 0 && strategie.playedEpochs.length > 1)
    strategie = await claimLastEpochs({ epoch, last: 6, strategie, contract })

  // if (strategie.playedEpochs.length >= 3) {
  // await claimPlayedEpochs(strategie.playedEpochs)
  // strategie.playedEpochs = []
  // }

  strategie.betAmount = calculateBetAmount()

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
    strategie = await claimLastEpochs({ epoch, last: 6, strategie, contract })
    if (strategie.currentAmount <= isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount) {
      logger.info(
        `[PLAYING] Stop Loss activated for player ${strategie.user.id} : current amount ${
          strategie.currentAmount
        } --> STOP LOSS : ${isUpdatedStrategie.startedAmount - isUpdatedStrategie.maxLooseAmount}`
      )
      await stopStrategie({ epoch, strategie, emitter, contract })
    }
  }

  if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
    strategie = await claimLastEpochs({ epoch, last: 6, strategie, contract })
    if (strategie.currentAmount >= isUpdatedStrategie.minWinAmount) {
      logger.info(
        `[PLAYING] Take Profit activated for player ${strategie.user.id} : current amount ${strategie.currentAmount} --> TAKE PROFIT : ${isUpdatedStrategie.minWinAmount}`
      )
      await stopStrategie({ epoch, strategie, emitter, contract })
    }
  }

  if (strategie.errorCount >= 5) {
    strategie = await claimLastEpochs({ epoch, last: 5, strategie, contract })
    logger.error('[PLAYING] Strategie had 5 error consecutively. Stopping it.')
    await stopStrategie({ epoch, strategie, emitter, contract })
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
    await stopStrategie({ epoch, strategie, emitter, contract })
  }

  return strategie
}

const listenSinglePlayer = async ({ strategie, provider, signer, contract, emitter }) => {
  // const initialBankrollBigInt = await provider.getBalance(signer.address)
  // strategie.initialBankroll = ethers.utils.formatEther(initialBankrollBigInt)
  // strategie.bankroll = strategie.initialBankroll
  // strategie.startedBalance = strategie.initialBankroll

  try {
    await prisma.strategie.update({
      where: { id: strategie.id },
      data: {
        isRunning: true,
        isNeedRestart: false,
      },
    })

    const isPaused = await contract.paused()

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
      return process.exit(0)
    }

    const epoch = await contract.currentEpoch()

    strategie = await claimLastEpochs({ epoch, last: 12, strategie, contract })
  } catch (error) {
    logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
  }
  // return
  const initialBankrollBigInt = await provider.getBalance(signer.address)
  strategie.currentAmount = +ethers.utils.formatEther(initialBankrollBigInt)
  // strategie.stepBankroll = strategie.startedAmount
  // strategie.betAmount = +(strategie.currentAmount / 15).toFixed(4)
  // strategie.betAmount = +(strategie.currentAmount / 13).toFixed(4)

  strategie.playedHashs = []
  strategie.playedEpochs = []
  strategie.errorCount = 0

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

  strategie.betAmount = calculateBetAmount()

  if (strategie.betAmount <= config.MIN_BET_AMOUNT || strategie.betAmount > config.MAX_BET_AMOUNT) {
    logger.error(`[LISTEN] Bet amount error, value is ${strategie.betAmount} Stopping strategie for now`)
    await stopStrategie({ epoch, strategie, emitter, contract })
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
  //   contract.on('EndRound', roundEndListenner)
  contract.on('EndRound', (epoch) => {
    strategie = roundEndListenner({ epoch, strategie, emitter, contract })
  })

  //   const { emitter: emt } = blocknative.account(strategie.player)
  //   emitter = emt
  //   emitter.on('txPool', processRound)
  emitter.on('txPool', (transaction) => {
    strategie = processRound({ transaction, stragtegie, emitter, contract })
  })
}

module.exports = {
  calculateBetAmount,
  optimizeBetAmount,
  checkIfClaimable,
  claimPlayedEpochs,
  stopStrategie,
  betRound,
  processRound,
  claimLastEpochs,
  roundEndListenner,
  listenSinglePlayer,
  listenPlayerAuto,
}
