const { PromisePool } = require('@supercharge/promise-pool')

const prisma = require('../../db/prisma')
const logger = require('../../utils/logger')
const { sleep } = require('../../utils/utils')

const { run } = require('../../jobs/strategies/claim-strategie')

const claim = async (strategie) => {
  const user = await prisma.user.findUnique({
    where: {
      id: strategie.userId,
    },
  })

  logger.info(`[CLAIMING] Claiming strategie ${strategie?.id} for user ${user?.address}`)

  await run({ strategie, user })
}

const claimStrategies = async () => {
  logger.info(`[CLAIMING] CLAIMING strategies claim`)

  // const condition = {isActive: true,}

  // if()
  const strategies = await prisma.strategie.findMany({
    where: {
      // isActive: true,
      // isRunning: false,
      // isError: false,
      isDeleted: false,
    },
  })

  logger.info(`[CLAIMING] ${strategies.length} strategies will be launched`)

  // await Promise.all(strategies.map(claim))
  await PromisePool.for(strategies).withConcurrency(1).process(claim)
  console.log('[CLAIMING] All finished')
}

module.exports = { claimStrategies }
