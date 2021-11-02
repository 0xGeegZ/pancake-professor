import { Wallet } from 'ethers'
import Web3Strategy from 'passport-web3'
import { encrypt } from 'src/server/utils/crpyto'

import prisma from '../db/prisma'

const web3Atuh = new Web3Strategy(async (address, done) => {
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
})

export default web3Atuh
