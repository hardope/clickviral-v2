import isUserorReadonly from '../apps/user/permissions/user';
import isAdmin from '../apps/user/permissions/admin';
import passport from'passport';
import { validateSchema } from './validator';
import logger from './logger';

const authorization = () => passport.authenticate('jwt', { session: false });

export { authorization, validateSchema, isUserorReadonly, isAdmin, logger };