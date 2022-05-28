// const { run } = require('../../jobs/launch-strategie/index')
const { run } = require('../../jobs/strategies/single-player/index')

const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')

const launchStrategieWithPm2 = async (strategieId) => {
  if (typeof strategieId === 'undefined') throw new Error('[LAUNCHING-STRATEGY] Need a strategieId')
  if (!strategieId) throw new Error('[LAUNCHING-STRATEGY] Need a strategieId')

  try {
    logger.info(`[LAUNCHING-STRATEGY] Launching strategies with pm2 for strategy ${strategieId}`)

    const strategie = await prisma.strategie.findUnique({
      where: {
        id: strategieId,
      },
    })

    if (!strategie) throw new Error('[LAUNCHING-STRATEGY] Strategie not finded')

    const user = await prisma.user.findUnique({
      where: {
        id: strategie.userId,
      },
    })

    if (!strategie) throw new Error('[LAUNCHING-STRATEGY] User not finded')

    await run({ strategie, user })
  } catch (error) {
    logger.error(`[LAUNCHING-STRATEGY] Error : ${error.message}.`)
    process.exit(0)
  }
}

launchStrategieWithPm2(process.argv[2])
module.exports = { launchStrategieWithPm2 }
