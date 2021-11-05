import passport from 'passport'

import { handler } from '../../../../server/api-route'

// export default handler().use(async (req, res) => {
// // console.log("🚀 ~ file: index.ts ~ line 5 ~ handler ~ res", res)
// // console.log("🚀 ~ file: index.ts ~ line 5 ~ handler ~ req", req)
// try {
//      passport.authenticate("web3")

// }catch(error){
// console.log("🚀 ~ file: index.ts ~ line 10 ~ handler ~ error", error)

// }

// });
export default handler()
  .use(passport.authenticate('web3'))
  // @ts-ignore
  .use((req, res) => {
    res.status(200).json({ success: true })
  })
