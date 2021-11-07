/* eslint-disable @typescript-eslint/no-var-requires */
const pm2 = require('pm2')
// const wait = require('./src/client/utils/wait')
const prisma = require('./server/db/prisma')

// https://pm2.keymetrics.io/docs/usage/pm2-api/
// const { promisify } = require('util')
// const { db } = require('./db/db')
// const { wait } = require('./utils/utils')

const logger = require('./server/utils/logger')

// TODO runs launch-strategies periodically
// https://stackoverflow.com/questions/42501219/how-to-make-a-task-job-with-pm2

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
      script: './scripts/pm2/launch-strategie/index.js',
      name: `strategie_${strategie.id}`,
      instances: 1,
      args: `${strategie.id}`,
      autorestart: false,
      stop_exit_codes: [0],
      // max_memory_restart: '300M'
      // restart_delay: 3000
      // cron_restart: "0 0 * * *",
      // env: {
      //   NODE_ENV: "development"
      // },
      // env_production: {
      //   NODE_ENV: "production"
      // }
      output: `./logs/pm2/play_${strategie.id}.log`,
      error: `./logs/pm2/play_${strategie.id}.error.log`,
      log: `./logs/pm2/combined_${strategie.id}.play.log`,
    },
    startLogs
  )
}

const stopAllStrategies = () => {
  // starting scrapper
  pm2.start(
    {
      script: 'server/scripts/pm2/stop-strategies/index.js',
      name: 'stopStrategies',
      instances: 1,
      watch: true,
      watch_delay: 1000,
      autorestart: false,
      stop_exit_codes: [0],
      // max_memory_restart: '300M'
      // restart_delay: 3000
      // evety ten minuts https://crontab.guru/every-10-minutes
      cron_restart: '*/10 * * * *',
      // env: {
      //   NODE_ENV: "development"
      // },
      // env_production: {
      //   NODE_ENV: "production"
      // }
      output: './logs/pm2/listen.log',
      error: './logs/pm2/listen.error.log',
      log: './logs/pm2/combined.listen.log',
    },
    startLogs
  )
}

const launchServices = async (error) => {
  if (error) {
    logger.error(error)
    process.exit(2)
  }

  logger.info('stopping strategies')
  stopAllStrategies()

  // logger.info('Launching strategies')
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

  pm2.list(listLog)
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
  disconnect()
  // await wait(5 * 1000)
  pm2.disconnect()
  process.exit(2)
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
