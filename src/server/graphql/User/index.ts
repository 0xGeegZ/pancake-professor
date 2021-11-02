import { extendType, list, nonNull, objectType, stringArg } from 'nexus'

import prisma from '../../db/prisma'

// import { GraphQLList, GraphQLNonNull } from 'graphql'
const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.strategies()
    t.model.email()
    t.model.address()
    t.model.generated()
    t.model.private()
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
      resolve: (_, __, ctx) => {
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
  },
})

export default [User, mutations, queries]
