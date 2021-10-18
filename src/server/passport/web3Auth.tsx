
import Web3Strategy  from 'passport-web3';

import prisma from "../db/prisma";

 const web3Atuh = new Web3Strategy(
  async (address, done)=> {    
    const user = await prisma.user.upsert({
      create: {
        address
      },
      update: {},
      where: {
          address,
      },
    });

      if (!user) { return done(null, false); }
      
      return  done(null, {
        ...user,
        id: user.id,
      });
  }
)
  
  export default web3Atuh;
