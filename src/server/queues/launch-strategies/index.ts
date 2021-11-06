import { launchStrategie } from 'src/pages/api/queues/launch-strategie'
import prisma from 'src/server/db/prisma'
import logger from 'src/server/utils/logger'

const launch = async (payload) => {
  const { user, ...strategie } = payload

  logger.info(`[LAUNCHING-LOCALLY] Launching strategie ${strategie.id} for user ${user.address}`)

  await launchStrategie({ strategie, user })
}

const launchStrategiesLocally = async () => {
  logger.info(`[LAUNCHING-LOCALLY] Launching strategies locally`)

  // load all stratégies (and associated user) that are not running
  const strategies = await prisma.strategie.findMany({
    // where: {
    //   id: ctx.user.id,
    // },
  })
  await Promise.all(strategies.map(launch))
}

launchStrategiesLocally()
// export default { launchStrategiesLocally }
// module.exports = {
//   launchStrategiesLocally,
// }
// module.exports = launchStrategiesLocally
