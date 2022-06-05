import { ethers } from 'ethers'
import { booleanArg, extendType, floatArg, intArg, nonNull, objectType, stringArg } from 'nexus'

import prisma from '../../db/prisma'
import { decrypt, encrypt } from '../../utils/crpyto'

const Strategie = objectType({
  name: 'Strategie',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.modifiedAt()
    t.model.player()
    t.model.name()
    t.model.color()
    t.model.generated()
    t.model.private()

    t.model.betAmountPercent()
    t.model.increaseAmount()
    t.model.decreaseAmount()

    t.model.startedAmount()
    t.model.currentAmount()
    t.model.stopLoss()
    t.model.takeProfit()
    t.model.isTrailing()
    t.model.roundsCount()
    t.model.playsCount()
    t.model.isActive()
    t.model.isRunning()
    t.model.isDeleted()
    t.model.isError()
    t.model.isNeedRestart()
    t.model.maxLooseAmount()
    t.model.minWinAmount()
    t.model.user()
    t.model.history()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    // This will add a { post(id: "...") { id title body } } query to the API
    t.field('strategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        // Only let authenticated users fetch posts
        if (!ctx.user?.id) return null

        return prisma.strategie.findFirst({
          where: {
            isDeleted: false,
            user: {
              is: {
                // Everyone can fetch the strategie that is logged in needs to be added only public strategie
                id: ctx.user.id,
              },
            },
            id,
          },
        })
      },
    })
  },
})

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('createStrategie', {
      type: 'Strategie',
      args: {
        player: nonNull(stringArg()),
        startedAmount: nonNull(floatArg()),
        // betAmountPercent: floatArg(),
        betAmountPercent: nonNull(floatArg()),
        increaseAmount: floatArg(),
        decreaseAmount: floatArg(),

        name: stringArg(),
        color: stringArg(),

        takeProfit: intArg(),
        stopLoss: intArg(),
        isTrailing: booleanArg(),
        maxLooseAmount: floatArg(),
        minWinAmount: floatArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        if (!user) return null

        // TODO create address and send funds to adress
        const walletInitial = ethers.Wallet.createRandom()
        // console.log('address:', wallet.address)
        // console.log('mnemonic:', wallet.mnemonic.phrase)
        // console.log('privateKey:', wallet.privateKey)
        // console.log('privateKey:', encrypt(wallet.privateKey))

        // TODO allow color selection from front end
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
        const randomName = args.name ? args.name : Math.random().toString(36).substring(2, 12)

        let strategie = null
        try {
          strategie = await prisma.strategie.create({
            data: {
              player: args.player,
              name: randomName,
              color: randomColor,
              generated: walletInitial.address.toLowerCase(),
              private: encrypt(walletInitial.privateKey),
              betAmountPercent: args.betAmountPercent,
              increaseAmount: args.increaseAmount,
              decreaseAmount: args.decreaseAmount,
              takeProfit: args.takeProfit,
              stopLoss: args.stopLoss,
              isTrailing: args.isTrailing,
              startedAmount: args.startedAmount,
              currentAmount: args.startedAmount,
              maxLooseAmount: args.maxLooseAmount,
              minWinAmount: args.minWinAmount,
              user: {
                connect: {
                  id: ctx.user.id,
                },
              },
            },
          })
        } catch (error) {
          console.log('🚀 ~ file: index.ts ~ line 166 ~ resolve: ~ error', error)
          throw new Error(error)
        }

        const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

        const privateKey = decrypt(user.private)

        const wallet = new ethers.Wallet(privateKey)

        const signer = wallet.connect(provider)

        const gasPrice = await provider.getGasPrice()

        const tx = {
          to: strategie.generated,
          value: ethers.utils.parseEther(`${strategie.startedAmount}`),
          nonce: provider.getTransactionCount(user.generated, 'latest'),
          gasPrice,
          gasLimit: ethers.utils.hexlify(250000),
        }

        try {
          await signer.sendTransaction(tx)
        } catch (error) {
          console.log('🚀 ~ file: index.ts ~ line 166 ~ resolve: ~ error', error)
          throw new Error(error)
        }

        return strategie
      },
    })

    t.nullable.field('updateStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
        betAmountPercent: floatArg(),
        player: stringArg(),
        increaseAmount: floatArg(),
        decreaseAmount: floatArg(),
        name: stringArg(),
        color: stringArg(),
        takeProfit: intArg(),
        stopLoss: intArg(),
        isTrailing: booleanArg(),
        roundsCount: intArg(),
        playsCount: intArg(),
        isActive: booleanArg(),
        isRunning: booleanArg(),
        isDeleted: booleanArg(),
        isError: booleanArg(),
        maxLooseAmount: floatArg(),
        minWinAmount: floatArg(),
      },
      resolve: async (_, { id, ...args }, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id,
          },
        })

        if (!hasAccess) return null

        let history = []

        if (args.player && args.player !== hasAccess.player) {
          const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray))

          const unique = (array) => [...new Set(array)]

          const concated = concat([hasAccess.player], hasAccess.history)
          // const uniqued = unique(concated)

          history = unique(concated)
          // args = {
          //   ...args,
          //   history: uniqued,
          // }
        }

        // TODO update history if updating player
        // if (hasAccess.player !== args.player) {
        //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //   const { id: oldId, userId, ...newDeletedStrategie } = hasAccess

        //   const strategie = await prisma.strategie.create({
        //     data: {
        //       ...newDeletedStrategie,
        //       isDeleted: true,
        //       isRunning: false,
        //       isActive: false,
        //       isError: false,
        //       user: {
        //         connect: {
        //           id: ctx.user.id,
        //         },
        //       },
        //     },
        //   })
        //   console.log('🚀 ~ file: index.ts ~ line 242 ~ resolve: ~ strategie', strategie)
        // }

        const difference = Object.keys(args).reduce((diff, key) => {
          if (hasAccess[key] === args[key]) return diff
          return {
            ...diff,
            [key]: args[key],
          }
        }, {})

        delete difference?.color
        delete difference?.name

        const { increaseAmount, decreaseAmount, ...restArgs } = args

        const data = {
          // ...args,
          ...restArgs,
          history,
          // isNeedRestart: true,
          isNeedRestart: Object.keys(difference).length !== 0,
          startedAmount: hasAccess.startedAmount,
        }

        if (increaseAmount || decreaseAmount) {
          data.startedAmount = hasAccess.startedAmount + (increaseAmount || decreaseAmount)
          // TODO recalculate stop loss and take profit
        }
        const updated = await prisma.strategie.update({
          where: { id },
          data,
        })

        if (!increaseAmount && !decreaseAmount) return updated

        console.log('Increasing or Decrasing Strategie')
        const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

        const privateKey = decrypt(increaseAmount ? ctx.user.private : updated.private)

        const wallet = new ethers.Wallet(privateKey)

        const signer = wallet.connect(provider)

        const gasPrice = await provider.getGasPrice()

        const tx = {
          to: increaseAmount ? updated.generated : ctx.user.generated,
          value: ethers.utils.parseEther(`${Math.abs(increaseAmount || decreaseAmount)}`),
          nonce: provider.getTransactionCount(increaseAmount ? ctx.user.generated : updated.generated, 'latest'),
          gasPrice,
          gasLimit: ethers.utils.hexlify(250000),
        }

        try {
          await signer.sendTransaction(tx)
        } catch (error) {
          console.log('🚀 ~ file: index.ts ~ line 307 ~ resolve: ~ error', error)
          throw new Error(error)
        }

        return updated
      },
    })

    t.nullable.field('toogleActivateStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id,
          },
        })

        if (!hasAccess) return null

        // await prisma.strategieHistory.deleteMany({
        //   where: {
        //     strategieId: id,
        //   },
        // })

        // const strategie = await prisma.strategie.delete({
        //   where: {
        //     id: id,
        //   },
        // })

        // return strategie

        return prisma.strategie.update({
          where: { id },
          data: {
            isActive: !hasAccess.isActive,
            isError: false,
          },
        })
      },
    })

    t.nullable.field('deleteStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        if (!user) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id,
          },
        })

        if (!hasAccess) return null

        const strategie = await prisma.strategie.update({
          where: { id },
          data: {
            isActive: false,
            isRunning: false,
            isNeedRestart: false,
            isDeleted: true,
            // currentAmount: 0.0,
          },
        })

        try {
          const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)
          const privateKey = decrypt(strategie.private)
          const wallet = new ethers.Wallet(privateKey)
          const signer = wallet.connect(provider)

          const rawGasPrice = await provider.getGasPrice()
          const rawBalance = await provider.getBalance(strategie.generated)
          const balance = ethers.utils.formatUnits(rawBalance)

          if (balance !== '0.0') {
            const gasPrice = ethers.utils.formatUnits(rawGasPrice)
            const gasLimit = await provider.estimateGas({
              to: user.generated,
              data: '0x',
              value: ethers.utils.parseEther(balance),
            })
            // TODO ERROR IF NOT ADDING 0.5% (works)
            const costs = +gasPrice * +gasLimit * 1.001

            const value = `${+balance - +costs}`

            const tx = {
              to: user.generated,
              value: ethers.utils.parseEther(value),
              nonce: provider.getTransactionCount(strategie.generated, 'latest'),
              gasPrice: rawGasPrice,
              gasLimit: ethers.utils.hexlify(gasLimit),
            }
            await signer.sendTransaction(tx)
          }
        } catch (error) {
          await prisma.strategie.update({
            where: { id },
            data: {
              currentAmount: hasAccess.currentAmount,
              isActive: hasAccess.isActive,
              isRunning: hasAccess.isRunning,
              isDeleted: hasAccess.isDeleted,
            },
          })
          throw new Error(error)
        }

        // TODO take commission if strategie won
        return strategie
      },
    })
  },
})

export default [Strategie, queries, mutations]
