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

  logger.info(
    `[CLAIMING] Job launching CLAIM STRATEGIE for strategie ${strategie.id} and address ${strategie.generated}`
  )

  const blockNativeOptions = {
    dappId: process.env.BLOCKNATIVE_API_KEY,
    networkId: +process.env.BINANCE_SMART_CHAIN_ID,
    ws: WebSocket,
    onerror: (error) => {
      logger.error(error)
      // TODO v0.0.3 restart strategie
      logger.error('[CLAIMING] Blocknative listenner error', error.toString())
      process.exit(0)
      // await stopStrategie({ epoch: -1 })
    },
  }
  const blocknative = new BlocknativeSdk(blockNativeOptions)

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

    const claimablesEpochs = claimables.filter((c) => c.isClaimable).map((c) => c.epoch)

    if (claimablesEpochs.length === 0) return logger.info('[CLAIM] Nothing to claim')

    logger.info(`[CLAIM] claimables epochs : ${claimablesEpochs}`)

    // const gasPrice = await provider.getGasPrice()

    const gasLimit = 350000 + 350000 * Math.round(claimablesEpochs.length / 5)
    console.log('🚀 ~ file: index.js ~ line 162 ~ claimPlayedEpochs ~ gasLimit', gasLimit)

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
    logger.error(`[CLAIMING] Stopping strategie ${strategie.id} for user ${user.id}`)

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

  const claimLastEpochs = async (epoch, to) => {
    const lastEpochs = [...range(+epoch - to, +epoch)]

    if (!lastEpochs.length) return logger.error(`[ERROR] Error during claiming for last epochs : no epochs findeds`)

    // await claimPlayedEpochs(lastEpochs)
    await claimPlayedEpochs([...new Set([...lastEpochs])])

    //wait for all transactions to completes
    // avoid error for stop loss if claim a lot of amount
    await sleep(10 * 1000)
    strategie.playedEpochs = []
  }

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
        isNeedRestart: false,
      },
    })
    const isPaused = await preditionContract.paused()

    if (isPaused) return logger.error(`[ERROR] Contract is paused. Waiting one hour `)
  } catch (error) {
    logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
  }

  try {
    const epoch = await preditionContract.currentEpoch()
    // await claimLastEpochs(epoch, 12 * 24)
    await claimLastEpochs(epoch, 12 * 24)
  } catch (error) {
    logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    // await stopStrategie({ epoch: -1 })
    // throw new Error(error)
  }
}

module.exports = { run }
