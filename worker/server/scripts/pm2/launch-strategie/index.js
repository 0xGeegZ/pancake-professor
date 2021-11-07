const BlocknativeSdk = require('bnc-sdk')
const { ethers } = require('ethers')
const WebSocket = require('ws')

const { launchStrategie } = require('../../launch-strategie/index')
const { PREDICTION_CONTRACT_ABI } = require('../../../../src/contracts/abis/pancake-prediction-abi-v3')

const { decrypt } = require('../../utils/crpyto')
const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')

const launchStrategieWithPm2 = async (strategieId) => {
  logger.info(`[LAUNCHING-LOCALLY] Launching strategies locally with pm2 for strategy ${strategieId}`)
  const strategie = await prisma.strategie.findUnique({
    where: {
      id: strategieId,
    },
  })
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  await launchStrategie({ strategie, user })
}

module.exports = { launchStrategieWithPm2 }
