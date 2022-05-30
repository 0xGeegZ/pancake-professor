const { Contract, Provider } = require('ethers-multicall')

const { ethers } = require('ethers')
const WebSocket = require('ws')
const { PromisePool } = require('@supercharge/promise-pool')

const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')

const { sleep, range } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

const run = async (payload) => {
  try {
    const { user, strategie } = payload

    // TODO define interface to stabilise objecti params that we need in addition to default fields
    // TODO load player from TheGraph to have special data like amountBNB played

    if (!user) throw new Error('No user given')
    if (!strategie) throw new Error('No strategie given')

    logger.info(
      `[CLAIMING] Job launching CLAIM STRATEGIE for strategie ${strategie.id} and address ${strategie.generated}`
    )

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

    const privateKey = decrypt(strategie.private)
    const signer = new ethers.Wallet(privateKey, provider)

    const preditionContract = new ethers.Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      config.PREDICTION_CONTRACT_ABI,
      signer
    )

    const bnbcallProvider = new Provider(provider)
    // Only required when `chainId` is not provided in the `Provider` constructor
    await bnbcallProvider.init()

    const preditionCallContract = new Contract(
      process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS,
      config.PREDICTION_CONTRACT_ABI,
      signer
    )

    const checkIfClaimable = async (epoch) => {
      try {
        const claimableCall = preditionCallContract.claimable(epoch, signer.address)
        const refundableCall = preditionCallContract.refundable(epoch, signer.address)
        const ledgerCall = preditionCallContract.ledger(epoch, signer.address)

        const [claimable, refundable, { claimed, amount }] = await bnbcallProvider.all([
          claimableCall,
          refundableCall,
          ledgerCall,
        ])

        // const [claimable, refundable, { claimed, amount }] = await Promise.all([
        //   preditionContract.claimable(epoch, signer.address),
        //   preditionContract.refundable(epoch, signer.address),
        //   preditionContract.ledger(epoch, signer.address),
        // ])

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

      const { results: claimables, errors } = await PromisePool.for(epochs)
        .withConcurrency(12)
        .process(checkIfClaimable)

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
        logger.info(`[CLAIM] claim ok for epochs : ${claimablesEpochs}`)
      } catch (error) {
        logger.error(`[CLAIM] Claim Tx Error for user ${user.id} and epochs ${claimablesEpochs}`)
        logger.error(error.message)
      }
    }

    const claimLastEpochs = async (epoch, to) => {
      const lastEpochs = [...range(+epoch - to, +epoch)]

      if (!lastEpochs.length) return logger.error(`[ERROR] Error during claiming for last epochs : no epochs findeds`)

      await claimPlayedEpochs([...new Set([...lastEpochs])])
    }

    const isPaused = await preditionContract.paused()
    if (isPaused) return logger.error(`[ERROR] Contract is paused. Waiting one hour `)

    try {
      const epoch = await preditionContract.currentEpoch()
      // await claimLastEpochs(epoch, 12 * 24 * 2)
      await claimLastEpochs(epoch, 12 * 10)
    } catch (error) {
      logger.error(`[ERROR] Error during claiming for last epochs : ${error.message}`)
    }
  } catch (error) {
    logger.error(
      `[CLAIMING] ERROR during Job CLAIM STRATEGIE for strategie ${strategie.id} and address ${strategie.generated}`
    )
    logger.error(`[CLAIMING] ${error.message}.`)
  }
}

module.exports = { run }
