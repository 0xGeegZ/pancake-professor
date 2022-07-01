const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')
const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')
const { stopStrategie, listenSinglePlayer } = require('../factory')
const { sleep, range } = require('../../../utils/utils')
const { decrypt } = require('../../../utils/crpyto')

const config = require('../../../providers/pancakeswap/config')

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

const run = async (payload) => {
  const { user, strategie } = payload

  // TODO define interface to stabilise objecti params that we need in addition to default fields
  // TODO load player from TheGraph to have special data like amountBNB played

  if (!user) throw new Error('No user given')
  if (!strategie) throw new Error('No strategie given')
  if (strategie.running) throw new Error('Strategie is already running')

  strategie.user = user

  const privateKey = decrypt(strategie.private)
  const signer = new ethers.Wallet(privateKey, provider)

  logger.info(
    `[LAUNCHING] Job launching job SINGLE PLAYER for strategie ${strategie.id} and address ${strategie.generated}`
  )

  const contract = new ethers.Contract(
    process.env.PANCAKE_PREDICTION_CONTRACT_ADDRESS_BNB,
    config.PREDICTION_CONTRACT_ABI_BNB,
    signer
  )

  const blocknative = new BlocknativeSdk(blockNativeOptions)
  const { emitter } = blocknative.account(strategie.player)

  try {
    await listenSinglePlayer({ strategie, contract, signer, emitter })
  } catch (error) {
    logger.error(
      `[ERROR] Stopping strategie for user ${strategie.generated} copy betting player ${strategie.player}: ${error}`
    )
    await stopStrategie({ epoch: -1, strategie, emitter, contract })
    throw new Error(error)
  }
}

module.exports = { run }
