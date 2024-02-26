import { Router } from 'express';
import * as userController from '../controller/user';
import * as authController from '../controller/auth';
import * as adminController from '../controller/admin';
import { userValidator } from '../middleware/validators/userValidator';
import { validateSchema } from '../middleware/validators/validator';
import { authorization, isUserorReadonly, isAdmin } from '../middleware/authorization';

const UserRouter = Router();

UserRouter.post('/admin/create', validateSchema(userValidator.CreateAdmin), adminController.CreateAdmin());
UserRouter.get('/admin/activate/:id', [authorization(), isAdmin()], adminController.activateUser());
UserRouter.get('/admin/deactivate/:id', [authorization(), isAdmin()], adminController.deactivateUser());

UserRouter.get('/', authorization(), isAdmin(), userController.getUsers());
UserRouter.post('/create', validateSchema(userValidator.register), userController.createUser());
UserRouter.get('/search', authorization(), userController.searchUser());
UserRouter.get('/:id', [authorization(), isUserorReadonly()], userController.getUser());
UserRouter.put('/:id', [authorization(), isUserorReadonly()], validateSchema(userValidator.update), userController.updateUser());
UserRouter.delete('/:id', [authorization(), isUserorReadonly()], userController.deleteUser());
UserRouter.post('/verify/:id', validateSchema(userValidator.verify), userController.verifyUser());
UserRouter.post('/find-account', validateSchema(userValidator.findAccount), userController.findAccount());
UserRouter.post('/deactivate/:id', [authorization(), isUserorReadonly()], userController.deactivateUser());
UserRouter.post('/send-verification-email/:id', userController.sendVerificationMail());
UserRouter.post('/forgot-password', validateSchema(userValidator.forgotPassword), authController.forgotPassword());
UserRouter.post('/reset-password', validateSchema(userValidator.resetPassword), authController.resetPassword());
UserRouter.post('/login', authController.login());

export default UserRouter;
