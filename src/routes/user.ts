import { Router } from 'express';
import { getUser } from '../controller/user';

const UserRouter = Router();

UserRouter.get('/', getUser);

export default UserRouter;
