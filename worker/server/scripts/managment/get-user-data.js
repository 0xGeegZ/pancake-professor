const { decrypt } = require('../../utils/crpyto')

const launch = () => {
  const mainAdress = 'mainAdress'
  const mainAdressPrivateCrypted = 'privatekey:encrypted'
  const mainAdressPrivate = decrypt(mainAdressPrivateCrypted)
  console.log('==================================================')
  console.log('mainAdress', mainAdress)
  console.log('mainAdressPrivateCrypted', mainAdressPrivateCrypted)
  console.log('mainAdressPrivate', mainAdressPrivate)
  console.log('==================================================')
}

launch()
// module.exports = { launch }
