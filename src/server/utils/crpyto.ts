import crypto from 'crypto'

// const dotenv = require('dotenv')
// dotenv.config()

const algorithm = 'aes-256-ctr'
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY

const iv = crypto.randomBytes(16)

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

  return decrpyted.toString()
}

export default { encrypt, decrypt }

// module.exports = {
//   encrypt,
//   decrypt
// }
