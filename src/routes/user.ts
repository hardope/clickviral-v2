import { Router } from 'express';
import * as userController from '../controller/user';
import * as AuthController from '../controller/auth';
import { userValidator } from '../middleware/validators/userValidator';
import { validateSchema } from '../middleware/validators/validator';
import { authorization } from '../middleware/authorization';

const UserRouter = Router();

UserRouter.get('/', authorization(), userController.getUsers());
UserRouter.post('/create', validateSchema(userValidator.register), userController.createUser());
UserRouter.get('/search', userController.searchUser());
UserRouter.get('/:id', userController.getUser());
UserRouter.put('/:id', validateSchema(userValidator.update), userController.updateUser());
UserRouter.delete('/:id', userController.deleteUser());
UserRouter.post('/login', AuthController.login());

export default UserRouter;
