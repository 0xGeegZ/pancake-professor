const prisma = require('../../../db/prisma')
const logger = require('../../../utils/logger')
const pm2 = require('pm2')

const launch = async (strategie) => {
  logger.info(`[LAUNCHING] Launching strategie ${strategie?.id}`)

  pm2.connect(() => {
    pm2.start({
      script: 'server/scripts/pm2/launch-strategie/index.js',
      name: `strategie_${strategie.id}`,
      instances: 1,
      args: `${strategie.id}`,
      autorestart: true,
      maxRestarts: 10,
      minUptime: 100,
      exp_backoff_restart_delay: 60 * 1000,
      // exec_mode: 'fork',
      output: `./logs/pm2/launchStrategie/${strategie.id}/output/play.log`,
      error: `./logs/pm2/launchStrategie/${strategie.id}/error/play.error.log`,
      log: `./logs/pm2/launchStrategie/${strategie.id}/log/combined.play.log`,
    })
  })
}

const launchStrategiesWithPM2 = async () => {
  logger.info(`[LAUNCHING] Launching strategies`)

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
}

launchStrategiesWithPM2()
module.exports = launchStrategiesWithPM2
