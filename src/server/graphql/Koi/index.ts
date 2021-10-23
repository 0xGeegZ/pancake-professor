// src/server/graphql/Koi/index.ts
import { objectType, extendType, nonNull, stringArg, intArg } from 'nexus';
import prisma from '../../db/prisma';

const Koi = objectType({
  name: 'Koi',
  definition(t) {
    t.model.id();
    t.model.modifiedAt();
    t.model.birthDate();
    t.model.youtube();
    t.model.variety();
    t.model.breeder();
    t.model.bloodline();
    t.model.skinType();
    t.model.sex();
    t.model.user();
    t.model.updates();
    t.model.purchasePrice();
  },
});

const queries = extendType({
  type: 'Query',
  definition: (t) => {
    // This will add a { post(id: "...") { id title body } } query to the API
    t.field('koi', {
      type: 'Koi',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, { id }, ctx) => {
        // Only let authenticated users fetch posts
        if (!ctx.user?.id) return null;

        return prisma.koi.findFirst({
          where: {
            // user: {
            //   is: {
            //     // Everyone can fetch the koi that is logged in needs to be added only public koi
            //     id: ctx.user.id,
            //   },
            // },
            id,
          },
        });
      },
    });
  },
});

const mutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nullable.field('createKoi', {
      type: 'Koi',
      args: {
        id: nonNull(stringArg()),
        variety: nonNull(stringArg()),
        breeder: stringArg(),
        bloodline: stringArg(),
        skinType: stringArg(),
        sex: stringArg(),
        birthDate: stringArg(),
        youtube: stringArg(),
        purchasePrice: intArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null;

        return await prisma.koi.create({
          data: {
            id: args.id,
            variety: args.variety,
            breeder: args.breeder,
            bloodline: args.bloodline,
            skinType: args.skinType,
            sex: args.sex,
            birthDate: args.birthDate,
            youtube: args.youtube,
            purchasePrice: args.purchasePrice,
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        });
      },
    });

    t.nullable.field('updateKoi', {
      type: 'Koi',
      args: {
        id: nonNull(stringArg()),
        variety: nonNull(stringArg()),
        breeder: stringArg(),
        bloodline: stringArg(),
        skinType: stringArg(),
        sex: stringArg(),
        birthDate: stringArg(),
        youtube: stringArg(),
        purchasePrice: intArg(),
      },
      resolve: async (_, args, ctx) => {
        if (!ctx.user?.id) return null;

        const hasAccess = await prisma.koi.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id: args.id,
          },
        });

        if (!hasAccess) return null;

        return await prisma.koi.update({
          where: { id: args.id },
          data: {
            variety: args.variety,
            breeder: args.breeder,
            bloodline: args.bloodline,
            skinType: args.skinType,
            sex: args.sex,
            birthDate: args.birthDate,
            youtube: args.youtube,
            purchasePrice: args.purchasePrice,
          },
        });
      },
    });

    t.nullable.field('deleteKoi', {
      type: 'Koi',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) return null;

        const hasAccess = await prisma.koi.findFirst({
          where: {
            user: {
              is: {
                id: ctx.user.id,
              },
            },
            id: id,
          },
        });

        if (!hasAccess) return null;

        await prisma.koiHistory.deleteMany({
          where: {
            koiId: id,
          },
        });

        const koi = await prisma.koi.delete({
          where: {
            id: id,
          },
        });

        return koi;
      },
    });
  },
});

export default [Koi, queries, mutations];
