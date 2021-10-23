import handler from '../../../../server/api-route';
import passport from 'passport';

export default handler()
  .use(passport.authenticate('local'))
  .use((req, res) => {
    res.redirect('/dasboard');
  });
