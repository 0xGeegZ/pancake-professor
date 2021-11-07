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
    t.model.generated()
    t.model.private()
    t.model.startedAmount()
    t.model.currentAmount()
    t.model.roundsCount()
    t.model.playsCount()
    t.model.isActive()
    t.model.isRunning()
    t.model.isDeleted()
    t.model.isError()
    t.model.maxLooseAmount()
    t.model.minWinAmount()
    t.model.user()
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

        const strategie = await prisma.strategie.create({
          data: {
            player: args.player,
            generated: walletInitial.address.toLowerCase(),
            private: encrypt(walletInitial.privateKey),
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
          throw new Error(error)
        }

        return strategie
      },
    })

    t.nullable.field('updateStrategie', {
      type: 'Strategie',
      args: {
        id: nonNull(stringArg()),
        player: nonNull(stringArg()),
        startedAmount: nonNull(floatArg()),
        currentAmount: nonNull(floatArg()),
        roundsCount: nonNull(intArg()),
        playsCount: nonNull(intArg()),
        isActive: booleanArg(),
        isRunning: booleanArg(),
        isDeleted: booleanArg(),
        isError: booleanArg(),
        maxLooseAmount: nonNull(floatArg()),
        minWinAmount: nonNull(floatArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        const hasAccess = await prisma.strategie.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id: args.id,
          },
        })

        if (!hasAccess) return null

        return prisma.strategie.update({
          where: { id: args.id },
          data: {
            player: args.player,
            startedAmount: args.startedAmount,
            currentAmount: args.currentAmount,
            roundsCount: args.roundsCount,
            playsCount: args.playsCount,
            isActive: args.isActive,
            isRunning: args.isRunning,
            isDeleted: args.isDeleted,
            isError: args.isError,
            maxLooseAmount: args.maxLooseAmount,
            minWinAmount: args.minWinAmount,
          },
        })
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
            // isActive: false,
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

        const strategie = await prisma.strategie.update({
          where: { id },
          data: {
            isActive: false,
            isRunning: false,
            isDeleted: true,
          },
        })

        const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

        const privateKey = decrypt(strategie.private)

        const wallet = new ethers.Wallet(privateKey)

        const signer = wallet.connect(provider)

        const rawGasPrice = await provider.getGasPrice()
        const rawBalance = await provider.getBalance(strategie.generated)

        const balance = ethers.utils.formatUnits(rawBalance)
        const gasPrice = ethers.utils.formatUnits(rawGasPrice)
        const gasLimit = await provider.estimateGas({
          to: user.generated,
          value: ethers.utils.parseEther(balance),
        })

        const costs = +gasPrice * +gasLimit
        const value = `${+balance - +costs}`

        const tx = {
          to: user.generated,
          value: ethers.utils.parseEther(value),
          nonce: provider.getTransactionCount(strategie.generated, 'latest'),
          gasPrice: rawGasPrice,
          gasLimit: ethers.utils.hexlify(gasLimit),
        }

        try {
          await signer.sendTransaction(tx)
        } catch (error) {
          await prisma.strategie.update({
            where: { id },
            data: {
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
