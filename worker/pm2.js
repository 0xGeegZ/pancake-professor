/* eslint-disable @typescript-eslint/no-var-requires */
const pm2 = require('pm2')
// const wait = require('./src/client/utils/wait')

// https://pm2.keymetrics.io/docs/usage/pm2-api/
// const { promisify } = require('util')
// const { db } = require('./db/db')
// const { wait } = require('./utils/utils')

// const logger = require('./src/server/utils/logger')

const listLog = (error, list) => {
  if (error) {
    console.error(error)
  }
  console.log('PM2 process list :')
  list.forEach(({ pid, name }) => {
    console.log(`process id ${pid} - name ${name}`)
  })
}

const startLogs = (error, [{ name }]) => {
  // const startLogs = (error, data) => {
  // console.log('🚀 ~ file: pm2.js ~ line 22 ~ startLogs ~ data', data)
  if (error) {
    console.error(error)
    return pm2.disconnect()
  }
  console.log(`process name ${name} started`)
}

// const startProcessForUser = async (user) => {
//   pm2.start(
//     {
//       script: './scripts/play-prediction.js',
//       name: `play_${user.id}`,
//       instances: 1,
//       args: `${user.id}`,
//       autorestart: false,
//       stop_exit_codes: [0],
//       // max_memory_restart: '300M'
//       // restart_delay: 3000
//       // cron_restart: "0 0 * * *",
//       // env: {
//       //   NODE_ENV: "development"
//       // },
//       // env_production: {
//       //   NODE_ENV: "production"
//       // }
//       output: `./logs/pm2/play_${user.id}.log`,
//       error: `./logs/pm2/play_${user.id}.error.log`,
//       log: `./logs/pm2/combined_${user.id}.play.log`,
//     },
//     startLogs
//   )
// }

const startScrapper = () => {
  // starting scrapper
  pm2.start(
    {
      script: './scripts/launch-strategies/index.js',
      name: 'launchStrategies',
      instances: 1,
      watch: true,
      watch_delay: 1000,
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
      output: './logs/pm2/listen.log',
      error: './logs/pm2/listen.error.log',
      log: './logs/pm2/combined.listen.log',
    },
    startLogs
  )
}

const launchServices = async (error) => {
  if (error) {
    console.error(error)
    process.exit(2)
  }

  startScrapper()

  // TODO filter users with process not already launched
  // const { data, error: selectError } = await db.from('users').select()

  // if (selectError) return console.error(`code : ${selectError.code} - message : ${selectError.message}`)

  // await Promise.all(data.map(startProcessForUser))

  pm2.list(listLog)
}

const disconnectService = (service) => {
  const callback = (error) => {
    if (error) return console.error(error)
    console.log(`process id ${service.pid} - name ${service.name} stopped`)
  }
  pm2.stop(service.name, callback)
}

const listAndDisconnect = (error, list) => {
  if (error) return console.error(error)
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
  console.error('Disconnected by CTRL+C')
  await disconnectAndExit()
})

const run = async () => {
  try {
    pm2.connect(launchServices)
  } catch (error) {
    console.error(error)
    await disconnectAndExit()
  }
}

run()
