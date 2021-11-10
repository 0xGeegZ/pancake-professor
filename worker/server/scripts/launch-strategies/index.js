const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')
const { sleep } = require('../../utils/utils')

const { launchStrategie } = require('../launch-strategie')

const launch = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[LAUNCHING] Launching strategie ${strategie?.id} for user ${user?.address}`)

  await launchStrategie({ strategie, user })
}

const launchStrategies = async () => {
  logger.info(`[LAUNCHING] Launching strategies locally`)
  const strategies = await prisma.strategie.findMany({
    where: {
      isActive: true,
      isRunning: false,
      isDeleted: false,
      isError: false,
    },
  })

  logger.info(`[LAUNCHING] ${strategies.length} strategies will be launched`)

  await Promise.all(strategies.map(launch))

  logger.info(`[WAITING] 10 minuts`)

  await sleep(60 * 1000 * 10)
  logger.info(`[WAITING] waiting done`)
  await launchStrategies()
}

module.exports = { launchStrategies }