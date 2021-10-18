
import passport from "passport";
// import passportLocal from "passport-local";
import { Strategy as LocalStrategy } from 'passport-local';

import prisma from "../db/prisma";

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

 const localAuth = new LocalStrategy({ usernameField: "address" }, async(address, done) => {
    const user = await prisma.user.upsert({
        create: {
          address,
        },
        update: {},
        where: {
            address,
        },
      });
      done(null, {
        ...user,
        id: user.id,
      });
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
  
  export default localAuth;
