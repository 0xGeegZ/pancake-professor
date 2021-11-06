import prisma from '../../../../server/db/prisma'
import logger from '../../../../server/utils/logger'
import { launchStrategie } from '../launch-strategie'

const launch = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[LAUNCHING-LOCALLY] Launching strategie ${strategie?.id} for user ${user?.address}`)

  await launchStrategie({ strategie, user })
}

export const launchStrategies = async () => {
  logger.info(`[LAUNCHING-LOCALLY] Launching strategies locally`)
  const strategies = await prisma.strategie.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      isRunning: false,
    },
  })
  await Promise.all(strategies.map(launch))
}

// export const launchStrategieJob = CronJob('api/jobs/launch-strategie', ['*/10 * * * *', 'Europe/Paris'], async () => {
//   await launchStrategies()
// })

// export default handler().post(async (req, res) => {
// await launchStrategies()
//   res.status(200).json({ success: true })
// })
