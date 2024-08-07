import { Router } from 'express';
import * as userController from './controller/user';
import * as authController from './controller/auth';
import * as adminController from './controller/admin';
import { userValidator, authValidator } from './validators';
import { validateSchema, authorization } from '../../middleware';
import { isUserorReadonly, isAdmin } from './permissions';
import upload from '../../utils/upload_manager';

const userRouter = Router();

userRouter.get('/admin/grant/:id', [authorization(), isAdmin()], adminController.grantAdminAccess());
userRouter.get('/admin/revoke/:id', [authorization(), isAdmin()], adminController.revokeAdminAccess());
userRouter.get('/admin/activate/:id', [authorization(), isAdmin()], adminController.activateUser());
userRouter.get('/admin/deactivate/:id', [authorization(), isAdmin()], adminController.deactivateUser());

userRouter.get('/', authorization(), isAdmin(), userController.getUsers());
userRouter.get('/me', authorization(), userController.getMe());
userRouter.post('/create', validateSchema(userValidator.register), userController.createUser());
userRouter.get('/search', authorization(), userController.searchUser());
userRouter.put('/security', authorization(), validateSchema(authValidator.security), authController.updateSecurity());
userRouter.get('/security', authorization(), authController.getSecurity());
userRouter.get('/:id', userController.getUser());
userRouter.get('/username/:username', userController.getUserByUsername());
userRouter.put('/:id', [authorization(), isUserorReadonly()], validateSchema(userValidator.update), userController.updateUser());
userRouter.delete('/:id', [authorization(), isUserorReadonly()], userController.deleteUser());
userRouter.post('/verify/:id', validateSchema(userValidator.verify), userController.verifyUser());
userRouter.post('/find-account', validateSchema(userValidator.findAccount), userController.findAccount());
userRouter.post('/deactivate/:id', [authorization(), isUserorReadonly()], userController.deactivateUser());
userRouter.post('/send-verification-email/:id', userController.sendVerificationMail());
userRouter.post('/send-reset-password-otp', validateSchema(userValidator.forgotPassword), authController.forgotPassword());
userRouter.post('/verify-otp', authController.verifyOtp());
userRouter.post('/reset-password', validateSchema(userValidator.resetPassword), authController.resetPassword());
userRouter.post('/send-change-email-otp', [authorization()], validateSchema(userValidator.startresetEmail), authController.startResetEmail());
userRouter.post('/change-email', [authorization()], validateSchema(userValidator.changeEmail), authController.changeEmail());
userRouter.post('/change-password', [authorization], authController.changePassword());
userRouter.post('/login', validateSchema(userValidator.login), authController.login());
userRouter.post('/refresh', authController.refresh());
userRouter.post('/two-factor-login', validateSchema(authValidator.twoFactorLogin), authController.twoFactorLogin());
userRouter.post('/upload-image', authorization(), upload.single('file'), userController.uploadImage());
userRouter.get('/get-images/:id', userController.getImages());

export default userRouter;
 