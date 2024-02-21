import { Router } from 'express';
import * as userController from '../controller/user';
import * as AuthController from '../controller/auth';
import { userValidator } from '../middleware/validators/userValidator';
import { validateSchema } from '../middleware/validators/validator';
import { authorization, isUserorReadonly, isAdmin } from '../middleware/authorization';

const UserRouter = Router();

UserRouter.get('/', authorization(), isAdmin(), userController.getUsers());
UserRouter.post('/create', validateSchema(userValidator.register), userController.createUser());
UserRouter.get('/search', authorization(), userController.searchUser());
UserRouter.get('/:id', [authorization(), isUserorReadonly()], userController.getUser());
UserRouter.put('/:id', [authorization(), isUserorReadonly()], validateSchema(userValidator.update), userController.updateUser());
UserRouter.delete('/:id', [authorization(), isUserorReadonly()], userController.deleteUser());
UserRouter.post('/login', AuthController.login());

export default UserRouter;
