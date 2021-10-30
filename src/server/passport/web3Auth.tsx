import { HDNode } from '@ethersproject/hdnode'
import Web3Strategy from 'passport-web3'

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
})

export default web3Atuh
