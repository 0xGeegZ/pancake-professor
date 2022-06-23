const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')
const { sleep } = require('../../utils/utils')

const { run } = require('../../jobs/strategies/single-player')

const launch = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[LAUNCHING] Launching strategie ${strategie?.id} for user ${user?.address}`)

  await run({ strategie, user })
}

const launchStrategies = async () => {
  logger.info(`[LAUNCHING] Launching strategies`)

  // const condition = {isActive: true,}

  // if()
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

  logger.info(`[WAITING] 2.5 minuts`)
  await sleep(60 * 1000 * 2.5)
  logger.info(`[WAITING] waiting done`)
  // await launchStrategies()
  return await launchStrategies()
}

module.exports = { launchStrategies }
