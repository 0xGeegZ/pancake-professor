// src/server/graphql/Koi/index.ts
import { objectType, extendType, nonNull, stringArg, intArg } from 'nexus';
import prisma from '../../db/prisma';

const KoiHistory = objectType({
  name: 'KoiHistory',
  definition(t) {
    t.model.length();
    t.model.date();
    t.model.image();
    t.model.id();
    t.model.koiId();
  },
});

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('koiHistory', {
      type: 'KoiHistory',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        // Only let authenticated users fetch posts
        if (!ctx.user?.id) return null;

        return prisma.koiHistory.findUnique({
          where: {
            id: id,
          },
        });
      },
    });
  },
});

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('createKoiHistory', {
      type: 'KoiHistory',
      args: {
        id: nonNull(stringArg()),
        length: intArg(),
        date: stringArg(),
        image: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        // Only let authenticated users create history
        if (!ctx.user?.id) return null;

        return await prisma.koiHistory.create({
          data: {
            length: args.length as number,
            date: args.date as string,
            image: args.image as string,
            koi: {
              connect: {
                id: args.id,
              },
            },
          },
        });
      },
    });

    t.nullable.field('updateKoiHistory', {
      type: 'KoiHistory',
      args: {
        id: nonNull(stringArg()),
        length: intArg(),
        date: stringArg(),
        image: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null;

        const hasAccess = await prisma.koiHistory.findFirst({
          where: {
            koi: {
              user: {
                is: {
                  id: ctx.user.id,
                },
              },
            },
            id: args.id,
          },
        });

        if (!hasAccess) return null;

        return await prisma.koiHistory.update({
          where: { id: args.id },
          data: {
            length: args.length as number,
            date: args.date as string,
            image: args.image as string,
          },
        });
      },
    });

    t.nullable.field('deleteKoiHistory', {
      type: 'KoiHistory',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null;

        const koiHistory = await prisma.koiHistory.delete({
          where: {
            id: id,
          },
        });

        return koiHistory;
      },
    });
  },
});

export default [KoiHistory, queries, mutations];
