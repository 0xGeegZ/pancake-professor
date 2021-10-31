import passport from 'passport'

import { handler } from '../../../../server/api-route'

export default handler()
  .use(passport.authenticate('local'))
  .use((req, res) => {
    res.redirect('/dasboard')
  })
