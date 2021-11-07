import crypto from 'crypto'

// Must be 256 bits (32 characters)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ADDRESS_SECRET_KEY || process.env.ADDRESS_SECRET_KEY
// For AES, this is always 16
const IV_LENGTH = 16

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

const decrypt = (hash) => {
  const textParts = hash.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export { encrypt, decrypt }
