import { Router } from 'express';
import * as userController from '../controller/user';
import * as authController from '../controller/auth';
import * as adminController from '../controller/admin';
import { userValidator } from '../middleware/validators/userValidator';
import { validateSchema } from '../middleware/validators/validator';
import { authorization, isUserorReadonly, isAdmin } from '../middleware/authorization';

const userRouter = Router();

userRouter.post('/admin/create', validateSchema(userValidator.createAdmin), adminController.CreateAdmin());
userRouter.get('/admin/activate/:id', [authorization(), isAdmin()], adminController.activateUser());
userRouter.get('/admin/deactivate/:id', [authorization(), isAdmin()], adminController.deactivateUser());

userRouter.get('/', authorization(), isAdmin(), userController.getUsers());
userRouter.post('/create', validateSchema(userValidator.register), userController.createUser());
userRouter.get('/search', authorization(), userController.searchUser());
userRouter.get('/:id', [authorization(), isUserorReadonly()], userController.getUser());
userRouter.put('/:id', [authorization(), isUserorReadonly()], validateSchema(userValidator.update), userController.updateUser());
userRouter.delete('/:id', [authorization(), isUserorReadonly()], userController.deleteUser());
userRouter.post('/verify/:id', validateSchema(userValidator.verify), userController.verifyUser());
userRouter.post('/find-account', validateSchema(userValidator.findAccount), userController.findAccount());
userRouter.post('/deactivate/:id', [authorization(), isUserorReadonly()], userController.deactivateUser());
userRouter.post('/send-verification-email/:id', userController.sendVerificationMail());
userRouter.post('/send-reset-password-otp', validateSchema(userValidator.forgotPassword), authController.forgotPassword());
userRouter.post('/reset-password', validateSchema(userValidator.resetPassword), authController.resetPassword());
userRouter.post('/send-change-email-otp', [authorization()], validateSchema(userValidator.startresetEmail), authController.startResetEmail());
userRouter.post('/change-email', [authorization()], validateSchema(userValidator.changeEmail), authController.changeEmail());
userRouter.post('/login', authController.login());
userRouter.post('/upload-image', authorization(), userController.uploadImage());
userRouter.get('/get-images/:id', userController.getImages());

export default userRouter;
