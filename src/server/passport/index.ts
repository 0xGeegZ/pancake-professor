import passport from "passport";
import magicLink from "./magicLink";
import localAuth from "./localAuth";
import web3Auth from "./web3Auth";
import prisma from "../db/prisma";

passport.use(magicLink);
passport.use(web3Auth);
passport.use(localAuth);

// This types passport.(de)serializeUser!
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      email: string;
      address: string;
      provider: string;
      redirect?: string;
    }
  }
}
 
passport.serializeUser(async (u: Express.User, done) => {
  const address = u.address.toLowerCase();

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
    ...u,
    id: user.id,
  });
});

passport.deserializeUser(async (user: Express.User, done) => {
  done(null, user);
});

export default passport;



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
