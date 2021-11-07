/* eslint-disable @typescript-eslint/no-var-requires */
const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')

const stopStrategie = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[STOPPING-LOCALLY] Stopping strategie ${strategie?.id} for user ${user?.address}`)

  await prisma.strategie.update({
    where: { id: strategie.id },
    data: {
      isRunning: false,
    },
  })
}

const stopStrategies = async () => {
  logger.info(`[STOPPING-LOCALLY] Stopping strategies locally`)
  const strategies = await prisma.strategie.findMany({
    where: {
      // isActive: true,
      isRunning: true,
    },
  })

  logger.info(`[STOPPING-LOCALLY] ${strategies.length} strategies will be stopped`)

  await Promise.all(strategies.map(stopStrategie))
  process.exit(0)
}

module.exports = { stopStrategies }
