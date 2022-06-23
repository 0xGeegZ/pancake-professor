/* eslint-disable @typescript-eslint/no-var-requires */
const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')

const stopStrategie = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[STOPPING] Stopping strategie ${strategie?.id} for user ${user?.address}`)

  await prisma.strategie.update({
    where: { id: strategie.id },
    data: {
      isRunning: false,
      isNeedRestart: false,
    },
  })
}

const stopStrategiesWithPM2 = async () => {
  logger.info(`[STOPPING] Stopping strategies`)
  const strategies = await prisma.strategie.findMany({
    where: {
      // isActive: true,
      isRunning: true,
    },
  })

  logger.info(`[STOPPING] ${strategies.length} strategies will be stopped`)

  await Promise.all(strategies.map(stopStrategie))

  // logger.info(`[STOPPING] Stopping process`)
  // process.exit(0)
}

// stopStrategiesWithPM2()
// module.exports = stopStrategiesWithPM2
module.exports = { stopStrategiesWithPM2 }
