import { ethers } from 'ethers'
import { extendType, list, nonNull, objectType, stringArg } from 'nexus'

import prisma from '../../db/prisma'
import { decrypt } from '../../utils/crpyto'

// import { GraphQLList, GraphQLNonNull } from 'graphql'
const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.strategies({
      type: `Strategie`,
      resolve: async (_, __, ctx) => {
        if (!ctx.user?.id) return null

        const strategies = await prisma.strategie.findMany({
          where: {
            // isDeleted: false,
            user: {
              is: {
                id: ctx.user.id,
              },
            },
          },
        })

        return strategies
      },
    })
    // t.model.strategies({
    //   filtering: {
    //     isActive: true,
    //     isDeleted: true,
    //     isRunning: true,
    //   },
    //   pagination: true,
    //   ordering: true,
    // })
    // t.bool("isAdmin", {
    //   resolve({ title }, args, ctx) {
    //     return title.toUpperCase(),
    //   }
    // })
    t.model.email()
    t.model.address()
    t.model.generated()
    t.model.private()
    t.model.isActivated()
    t.model.referrals()
    t.model.registeredAt()
    t.model.loginAt()
    t.model.createdAt()
    t.model.modifiedAt()
  },
})

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('currentUser', {
      type: 'User',
      resolve: async (_, __, ctx) => {
        if (!ctx.user?.id) return null

        return prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })
      },
    })

    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        if (!ctx.user?.id) return null

        return prisma.user.findUnique({
          where: {
            id,
          },
        })
      },
    })

    t.field('getUsers', {
      // type: 'User',
      type: list('User'),
      // args: {
      //   ids: list(stringArg()), // or list('String') -> [String]
      // },
      // resolve: (_, { id }, ctx) => {
      // resolve: (_, args, ctx) =>
      resolve: () =>
        // resolve: (_, __, ctx) => {
        // resolve() {
        // if (!ctx.user?.id) return null

        // return prisma.user.findMany({
        prisma.user.findMany({
          // where: {
          //   id: ctx.user.id,
          // },
        }),
    })
  },
})

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('updateUser', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
        email: stringArg(),
        address: nonNull(stringArg()),
        // isActivated: boolArgs(),
      },
      resolve: async (_, { id, name, email, address }, ctx) => {
        if (!ctx.user?.id || id !== ctx.user.id) return null

        const data = {
          name: name || '',
          email: email || '',
          address,
          // updatedAt: new Date(),
          modifiedAt: new Date(),
        }

        return prisma.user.update({
          where: { id },
          data,
        })
      },
    })

    t.nullable.field('createFriend', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        const userExists = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        if (!userExists) return null
        if (ctx.user.id === args.id) return null

        return prisma.user.update({
          where: { id: ctx.user?.id },
          data: {
            referrals: {
              connect: {
                id: args.id,
              },
            },
          },
        })
      },
    })

    t.nullable.field('removeFunds', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        value: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null

        const userExists = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        if (!userExists) return null
        if (ctx.user.id !== args.id) return null

        const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER)

        const privateKey = decrypt(userExists.private)

        const wallet = new ethers.Wallet(privateKey)

        const signer = wallet.connect(provider)

        const rawGasPrice = await provider.getGasPrice()
        const gasPrice = ethers.utils.formatUnits(rawGasPrice)

        let bnbValue = `${parseFloat(args.value).toFixed(10)}`
        console.log('🚀 ~ file: index.ts ~ line 204 ~ resolve: ~ bnbValue', bnbValue)

        const gasLimit = await provider.estimateGas({
          to: userExists.generated,
          value: ethers.utils.parseEther(bnbValue),
        })

        const rawBalance = await provider.getBalance(userExists.generated)
        const balance = ethers.utils.formatUnits(rawBalance)

        if (parseFloat(balance).toFixed(14) === parseFloat(args.value).toFixed(14)) {
          // TODO ERROR IF NOT ADDING 0.5% (works)
          const costs = +gasPrice * +gasLimit * 1.001
          bnbValue = `${+args.value - +costs}`
        }

        const tx = {
          to: userExists.address,
          value: ethers.utils.parseEther(bnbValue),
          nonce: provider.getTransactionCount(userExists.generated, 'latest'),
          gasPrice: rawGasPrice,
          gasLimit: ethers.utils.hexlify(gasLimit),
        }

        try {
          await signer.sendTransaction(tx)
        } catch (error) {
          throw new Error(error)
        }

        return userExists
      },
    })

    t.nullable.field('toogleIsActivated', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        // TODO allow only admins
        if (!ctx.user?.id || id !== ctx.user.id) return null

        const user = await prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })

        return prisma.user.update({
          where: { id },
          data: {
            isActivated: !user.isActivated,
          },
        })
      },
    })
  },
})

export default [User, mutations, queries]
