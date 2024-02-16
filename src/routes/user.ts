import { Router } from 'express';
import { createUser, getUsers } from '../controller/user';
import { userValidator } from '../middleware/validators/userValidator';
import {validateSchema} from '../middleware/validators/validator';

const UserRouter = Router();

UserRouter.get('/', getUsers());
UserRouter.post('/create', validateSchema(userValidator.register), createUser());

export default UserRouter;
