const pm2 = require('pm2')
const prisma = require('./server/db/prisma')
const logger = require('./server/utils/logger')
const { stopStrategiesWithPM2 } = require('./server/scripts/pm2/stop-strategies/index')
const { sleep } = require('./server/utils/utils')

const listLog = (error, list) => {
  if (error) {
    logger.error(error)
  }
  logger.info('PM2 process list :')
  list.forEach(({ pid, name }) => {
    logger.info(`process id ${pid} - name ${name}`)
  })
}

// const startLogs = (error, [{ name }]) => {
const startLogs = (error, data) => {
  if (error) {
    logger.error(error)
    return pm2.disconnect()
  }
  if (!data) return

  const [{ name }] = data
  logger.info(`process name ${name} started`)
}

const launchStrategieForUser = async (strategie) => {
  pm2.start(
    {
      script: 'server/scripts/pm2/launch-strategie/index.js',
      name: `strategie_${strategie.id}`,
      instances: 1,
      args: `${strategie.id}`,
      autorestart: true,
      max_restarts: 10,
      // exec_mode: 'fork',
      output: `./logs/pm2/launchStrategie/${strategie.id}/output/play.log`,
      error: `./logs/pm2/launchStrategie/${strategie.id}/error/play.error.log`,
      log: `./logs/pm2/launchStrategie/${strategie.id}/log/combined.play.log`,
    },
    startLogs
  )
}

const stopAllStrategies = async () => {
  // pm2.start(
  //   {
  //     script: 'server/scripts/pm2/stop-strategies/index.js',
  //     name: 'stopStrategies',
  //     instances: 1,
  //     autorestart: false,
  //     stop_exit_codes: [0],
  //     // exec_mode: 'fork',
  //     // evety ten minuts https://crontab.guru/every-10-minutes
  //     // cron_restart: '*/10 * * * *',
  //     output: './logs/pm2/stopStrategies/listen.log',
  //     error: './logs/pm2/stopStrategies/listen.error.log',
  //     log: './logs/pm2/stopStrategies/combined.listen.log',
  //   },
  //   startLogs
  // )
  await stopStrategiesWithPM2()
}

const launchAllStrategies = () => {
  pm2.start(
    {
      script: 'server/scripts/pm2/launch-strategies/index.js',
      name: 'launchStrategies',
      instances: 1,
      autorestart: false,
      stop_exit_codes: [0],
      exec_mode: 'fork',
      // evety hour at 57' minuts https://crontab.guru/#57_*_*_*_*
      cron_restart: '57 * * * *',
      output: './logs/pm2/launchStrategies/listen.log',
      error: './logs/pm2/launchStrategies/listen.error.log',
      log: './logs/pm2/launchStrategies/combined.listen.log',
    },
    startLogs
  )
}

const launchServices = async (error) => {
  if (error) {
    logger.error(error)
    process.exit(2)
  }

  logger.info('********************')
  logger.info('stopping strategies')
  await stopAllStrategies()
  logger.info('********************')

  await sleep(5 * 1000)
  logger.info('********************')
  logger.info('Launching strategies')
  launchAllStrategies()
  // const strategies = await prisma.strategie.findMany({
  //   where: {
  //     isActive: true,
  //     isRunning: false,
  //     isDeleted: false,
  //     isError: false,
  //   },
  // })

  // logger.info(`[LAUNCHING-LOCALLY] ${strategies.length} strategies will be launched`)

  // await Promise.all(strategies.map(launchStrategieForUser))
  logger.info('********************')

  pm2.list(listLog)

  await sleep(5 * 1000)
  disconnectAndExit()
}

const disconnectService = (service) => {
  const callback = (error) => {
    if (error) return logger.error(error)
    logger.info(`process id ${service.pid} - name ${service.name} stopped`)
  }
  pm2.stop(service.name, callback)
}

const listAndDisconnect = (error, list) => {
  if (error) return logger.error(error)
  list.forEach(disconnectService)
}

const disconnect = () => {
  pm2.list(listAndDisconnect)
}

const disconnectAndExit = async () => {
  // disconnect()
  // await sleep(5 * 1000)
  pm2.disconnect()
  process.exit(0)
}

process.on('SIGINT', async () => {
  logger.error('Disconnected by CTRL+C')
  await disconnectAndExit()
})

const run = async () => {
  try {
    pm2.connect(launchServices)
  } catch (error) {
    logger.error(error)
    await disconnectAndExit()
  }
}

run()
