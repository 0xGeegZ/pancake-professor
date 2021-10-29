import passport from 'passport'

import localAuth from './localAuth'
import magicLink from './magicLink'
import web3Auth from './web3Auth'

passport.use(magicLink)
passport.use(web3Auth)
passport.use(localAuth)

// This types passport.(de)serializeUser!
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string
      email: string
      address: string
      generated: string
      provider: string
      redirect?: string
    }
  }
}

passport.serializeUser(async (u: Express.User, done) => {
  console.log('🚀 ~ file: index.ts ~ line 26 ~ passport.serializeUser ~ u', u)
  // const address = u.address.toLowerCase()

  // const user = await prisma.user.upsert({
  //   create: {
  //     address,
  //   },
  //   update: {},
  //   where: {
  //     address,
  //   },
  // });

  done(null, {
    ...u,
    id: u.id,
  })
})

passport.deserializeUser(async (user: Express.User, done) => {
  done(null, user)
})

export default passport

// passport.serializeUser(async (u: Express.User, done) => {
//   const email = u.email.toLowerCase();
//   const user = await prisma.user.upsert({
//     create: {
//       email,
//     },
//     update: {},
//     where: {
//       email,
//     },
//   });

//   done(null, {
//     ...u,
//     id: user.id,
//   });
// });

// passport.deserializeUser(async (user: Express.User, done) => {
//   done(null, user);
// });

// export default passport;
