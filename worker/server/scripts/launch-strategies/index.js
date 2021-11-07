/* eslint-disable @typescript-eslint/no-var-requires */
const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')
const { launchStrategie } = require('../launch-strategie')

const launch = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[LAUNCHING-LOCALLY] Launching strategie ${strategie?.id} for user ${user?.address}`)

  await launchStrategie({ strategie, user })
}

const launchStrategies = async () => {
  logger.info(`[LAUNCHING-LOCALLY] Launching strategies locally`)
  const strategies = await prisma.strategie.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      isRunning: false,
    },
  })

  logger.info(`[LAUNCHING-LOCALLY] ${strategies.length} strategies will be launched`)

  await Promise.all(strategies.map(launch))
  // process.exit(0)
}

module.exports = { launchStrategies }
