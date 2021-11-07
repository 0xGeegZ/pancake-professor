import { Wallet } from 'ethers'
import { Strategy as LocalStrategy } from 'passport-local'
import { encrypt } from 'src/server/utils/crpyto'

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
      const wallet = Wallet.createRandom()
      // console.log('address:', wallet.address)
      // console.log('mnemonic:', wallet.mnemonic.phrase)
      // console.log('privateKey:', wallet.privateKey)
      // console.log('privateKey:', encrypt(wallet.privateKey))

      user = await prisma.user.create({
        data: {
          address,
          generated: wallet.address.toLowerCase(),
          private: encrypt(wallet.privateKey),
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

    console.log('🚀 ~ file: localAuth.tsx ~ line 59 ~ localAuth ~ user', user)

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
