import { HDNode } from '@ethersproject/hdnode'
import { Strategy as LocalStrategy } from 'passport-local'

import prisma from '../db/prisma'

// import passportLocal from "passport-local";
// import { find } from "lodash";

// const LocalStrategy = passportLocal.Strategy;

// declare global {
//     // eslint-disable-next-line @typescript-eslint/no-namespace
//     namespace Express {
//       interface User {
//         id: string;
//         address: string;
//         provider: string;
//         redirect?: string;
//       }
//     }
//   }

/**
 * Sign in using Email and Password.
 */

const localAuth = new LocalStrategy({ usernameField: 'address' }, async (address, done) => {
  try {
    const finded = await prisma.user.findUnique({
      where: {
        address,
      },
    })

    let user
    if (!finded) {
      const mnemonic = process.env.MNEMONIC

      const masterNode = HDNode.fromMnemonic(mnemonic)

      const standardEthereum = masterNode.derivePath("m/44'/60'/0'/0/0")

      console.log(standardEthereum.publicKey)
      console.log(standardEthereum.privateKey)

      // const generated = standardEthereum.publicKey
      // const privateKey = standardEthereum.privateKey

      user = await prisma.user.create({
        data: {
          address,
          generated: standardEthereum.publicKey,
          private: standardEthereum.privateKey,
          // generated: generated.toString(),
          // private: privateKey.toString(),
        },
      })
    } else {
      user = await prisma.user.update({
        where: { id: finded.id },
        // where: { address },
        data: {
          loginAt: new Date(),
        },
      })
    }

    if (!user) {
      return done(null, false)
    }

    return done(null, {
      ...user,
      id: user.id,
    })
  } catch (error) {
    done(error, null)
  }
  // const user = await prisma.user.upsert({
  //   create: {
  //     address,
  //   },
  //   update: {},
  //   where: {
  //     address,
  //   },
  // })
  // done(null, {
  //   ...user,
  //   id: user.id,
  // })
})
//  passport.use(new LocalStrategy({ usernameField: "address" }, async(address, done) => {
//     const user = await prisma.user.upsert({
//         create: {
//           address,
//         },
//         update: {},
//         where: {
//             address,
//         },
//       });
//       done(null, {
//         ...user,
//         id: user.id,
//       });
// }));

//   passport.serializeUser(async (u: Express.User, done) => {
//     const email = u.address.toLowerCase();
//     const user = await prisma.user.upsert({
//       create: {
//         address,
//       },
//       update: {},
//       where: {
//         address,
//       },
//     });

//     done(null, {
//       ...u,
//       id: user.id,
//     });
//   });

//   passport.deserializeUser(async (user: Express.User, done) => {
//     done(null, user);
//   });

export default localAuth
