import isUserorReadonly from './permissions/user';
import isAdmin from './permissions/admin';
import passport from'passport';

const authorization = () => passport.authenticate('jwt', { session: false });

export { authorization, isUserorReadonly, isAdmin };