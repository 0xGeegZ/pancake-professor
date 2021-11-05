import { decrypt, encrypt } from './crpyto'
import logger from './logger'

logger.info('===================')
const hash = encrypt('Hello World!')
logger.info(hash)
// {
//   iv: 'f7783692592275e8b58ee8f22bfdaefc',
//   content: '24a50c911ac6274283f259f3'
// }
const text = decrypt(hash)
logger.info(text)
logger.info('===================')
